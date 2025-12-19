"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, Link as LinkIcon, BookOpen, HelpCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTeamResource, type TeamResource as TeamResourceDB, type TaskTeam } from "@/lib/team-resources-db";
import { toast } from "sonner";
import { UploadResourceDialog } from "./upload-resource-dialog";

interface TeamResourcesProps {
  resources: TeamResourceDB[];
  team: TaskTeam;
  teamName: string;
  orgId: string;
  onResourceDeleted?: () => void;
}

const resourceIcons = {
  document: FileText,
  link: LinkIcon,
  guide: BookOpen,
  other: HelpCircle,
};

const resourceTypeLabels = {
  document: "Document",
  link: "Link",
  guide: "Guide",
  other: "Resource",
};

export function TeamResources({
  resources,
  team,
  teamName,
  orgId,
  onResourceDeleted,
}: TeamResourcesProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<TeamResourceDB | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResourceChange = () => {
    router.refresh();
    onResourceDeleted?.();
  };

  const handleDeleteClick = (resource: TeamResourceDB, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResourceToDelete(resource);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteTeamResource(resourceToDelete.id, orgId);
      if (result.success) {
        toast.success("Resource deleted successfully");
        setDeleteDialogOpen(false);
        setResourceToDelete(null);
        handleResourceChange();
      } else {
        toast.error(result.error || "Failed to delete resource");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Resources & Links</CardTitle>
            <CardDescription>
              Important documents, guides, and links for the {teamName} team.
            </CardDescription>
          </div>
          <UploadResourceDialog team={team} orgId={orgId} onSuccess={handleResourceChange} />
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No resources yet. Add a document or link to get started.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {resources.map((resource) => {
                const Icon = resourceIcons[resource.resource_type] || HelpCircle;
                // For documents, use API route to get signed URL; for links, use the URL directly
                const resourceUrl =
                  resource.resource_type === "document" && resource.storage_path
                    ? `/api/team-resources/${resource.id}/url?storage_path=${encodeURIComponent(resource.storage_path)}`
                    : resource.url;
                return (
                  <div
                    key={resource.id}
                    className="group relative flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3 transition-all hover:border-border hover:bg-accent/50"
                  >
                    <Link
                      href={resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium leading-none group-hover:text-primary">
                              {resource.title}
                            </h4>
                            <ExternalLink className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                          {resource.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {resource.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              {resourceTypeLabels[resource.resource_type]}
                            </span>
                            {resource.file_size && (
                              <span className="text-[10px] text-muted-foreground">
                                • {(resource.file_size / 1024).toFixed(1)} KB
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => handleDeleteClick(resource, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resourceToDelete?.title}"? This action cannot be undone.
              {resourceToDelete?.storage_path && " The file will also be removed from storage."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

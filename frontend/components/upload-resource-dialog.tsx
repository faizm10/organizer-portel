"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { uploadTeamDocument, createTeamResource, type TaskTeam, type ResourceType } from "@/lib/team-resources-db";
import { toast } from "sonner";

interface UploadResourceDialogProps {
  team: TaskTeam;
  orgId: string;
  onSuccess?: () => void;
}

export function UploadResourceDialog({ team, orgId, onSuccess }: UploadResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resourceType, setResourceType] = useState<"document" | "link">("document");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        // Auto-fill title with filename (without extension)
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      setFile(null);
      setTitle("");
      setDescription("");
      setUrl("");
      setResourceType("document");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resourceType === "document" && !file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (resourceType === "link" && !url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsUploading(true);

    try {
      if (resourceType === "document" && file) {
        const result = await uploadTeamDocument(
          file,
          team,
          title.trim(),
          description.trim() || undefined,
          orgId
        );

        if (result.success) {
          toast.success("Document uploaded successfully");
          handleOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.error || "Failed to upload document");
        }
      } else if (resourceType === "link") {
        const result = await createTeamResource(
          {
            team,
            title: title.trim(),
            description: description.trim() || undefined,
            resource_type: "link",
            url: url.trim(),
          },
          orgId
        );

        if (result.success) {
          toast.success("Link added successfully");
          handleOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.error || "Failed to add link");
        }
      }
    } catch (error) {
      console.error("Error uploading resource:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>
              Upload a document or add a link for the {team} team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="resource-type">Resource Type</Label>
              <Select
                value={resourceType}
                onValueChange={(value) => setResourceType(value as "document" | "link")}
              >
                <SelectTrigger id="resource-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document (Upload File)</SelectItem>
                  <SelectItem value="link">Link (External URL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {resourceType === "document" ? (
              <div className="grid gap-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.svg"
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isUploading}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Resource title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this resource"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {resourceType === "document" ? "Uploading..." : "Adding..."}
                </>
              ) : (
                <>
                  {resourceType === "document" ? (
                    <Upload className="mr-2 h-4 w-4" />
                  ) : (
                    <LinkIcon className="mr-2 h-4 w-4" />
                  )}
                  {resourceType === "document" ? "Upload" : "Add Link"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

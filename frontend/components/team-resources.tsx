"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, Link as LinkIcon, BookOpen, HelpCircle } from "lucide-react";
import Link from "next/link";

export type ResourceType = "document" | "link" | "guide" | "other";

export interface TeamResource {
  id: string;
  title: string;
  url: string;
  description?: string;
  type: ResourceType;
}

interface TeamResourcesProps {
  resources: TeamResource[];
  teamName: string;
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

export function TeamResources({ resources, teamName }: TeamResourcesProps) {
  if (resources.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources & Links</CardTitle>
        <CardDescription>
          Important documents, guides, and links for the {teamName} team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {resources.map((resource) => {
            const Icon = resourceIcons[resource.type] || HelpCircle;
            return (
              <Link
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3 transition-all hover:border-border hover:bg-accent/50"
              >
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
                      {resourceTypeLabels[resource.type]}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

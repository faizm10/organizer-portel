"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteEventPerson, type EventPerson } from "@/lib/people";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Phone, Building2, Briefcase, Trash2 } from "lucide-react";

interface PeopleListProps {
  people: EventPerson[];
  type: "volunteer" | "mentor" | "judge" | "sponsor" | "partner";
  onDelete?: (id: string) => void;
}

export function PeopleList({ people, type, onDelete }: PeopleListProps) {
  const router = useRouter();

  const handleDelete = async (personId: string) => {
    const result = await deleteEventPerson(personId);
    if (result.success) {
      toast.success("Person removed successfully");
      router.refresh();
      onDelete?.(personId);
    } else {
      toast.error(result.error || "Failed to remove person");
    }
  };

  if (people.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">No {type}s yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <Card key={person.id} className="relative">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {person.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{person.full_name}</h3>
                    {person.role_title && (
                      <p className="text-xs text-muted-foreground truncate">
                        {person.role_title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  {person.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{person.phone}</span>
                    </div>
                  )}
                  {person.company && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{person.company}</span>
                    </div>
                  )}
                </div>

                {person.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{person.bio}</p>
                )}

                {person.skills && person.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {person.skills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {person.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{person.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {person.full_name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this person from the event. This action cannot
                      be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(person.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

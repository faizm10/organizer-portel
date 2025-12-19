"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";
import type { OrgMember } from "@/lib/org";

interface OrganizersListProps {
  organizers: OrgMember[];
}

export function OrganizersList({ organizers }: OrganizersListProps) {
  if (organizers.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">No organizers yet.</p>
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return null;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizers.map((member) => {
            const initials = getInitials(member.profile.full_name);
            const displayName = member.profile.full_name || "Unknown User";
            return (
              <TableRow key={member.user_id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {initials || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{displayName}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.role === "lead" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

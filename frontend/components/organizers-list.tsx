"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import type { OrgMember, OrgTeam } from "@/lib/org";

interface OrganizersListProps {
  organizers: OrgMember[];
}

export function OrganizersList({ organizers }: OrganizersListProps) {
  const [selectedTeam, setSelectedTeam] = useState<OrgTeam | "all">("all");

  const teamLabels: Record<string, string> = {
    tech: "Tech",
    logistics: "Logistics",
    sponsorship: "Sponsorship",
    outreach: "Outreach",
  };

  const teams: (OrgTeam | "all")[] = ["all", "tech", "logistics", "sponsorship", "outreach"];

  const filteredOrganizers =
    selectedTeam === "all"
      ? organizers
      : organizers.filter((member) => member.team === selectedTeam);

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
    <div className="space-y-4">
      {/* Team filter buttons */}
      <div className="flex flex-wrap gap-2">
        {teams.map((team) => (
          <Button
            key={team}
            variant={selectedTeam === team ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTeam(team)}
            className="rounded-full"
          >
            {team === "all" ? "All Teams" : teamLabels[team]}
            {team !== "all" && (
              <span className="ml-2 rounded-full bg-background/50 px-1.5 py-0.5 text-xs">
                {organizers.filter((m) => m.team === team).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Organizers table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No organizers found for this team.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrganizers.map((member) => {
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
                    <TableCell>
                      {member.team ? (
                        <Badge variant="outline">{teamLabels[member.team] || member.team}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

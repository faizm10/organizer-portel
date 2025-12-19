"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { TaskStatus, TaskPriority } from "@/lib/tasks";
import type { OrgMember } from "@/lib/org";

export type TaskFilters = {
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  assignedTo: string[]; // array of user IDs or "__unassigned__"
  searchQuery: string;
};

interface TasksFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  orgMembers: OrgMember[];
}

export function TasksFilters({ filters, onFiltersChange, orgMembers }: TasksFiltersProps) {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);

  // Sync local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleStatusToggle = (status: TaskStatus) => {
    const newStatuses = localFilters.statuses.includes(status)
      ? localFilters.statuses.filter((s) => s !== status)
      : [...localFilters.statuses, status];
    const newFilters = { ...localFilters, statuses: newStatuses };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriorityToggle = (priority: TaskPriority) => {
    const newPriorities = localFilters.priorities.includes(priority)
      ? localFilters.priorities.filter((p) => p !== priority)
      : [...localFilters.priorities, priority];
    const newFilters = { ...localFilters, priorities: newPriorities };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAssignedToToggle = (userId: string) => {
    const newAssignedTo = localFilters.assignedTo.includes(userId)
      ? localFilters.assignedTo.filter((id) => id !== userId)
      : [...localFilters.assignedTo, userId];
    const newFilters = { ...localFilters, assignedTo: newAssignedTo };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (query: string) => {
    const newFilters = { ...localFilters, searchQuery: query };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters: TaskFilters = {
      statuses: [],
      priorities: [],
      assignedTo: [],
      searchQuery: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount =
    localFilters.statuses.length +
    localFilters.priorities.length +
    localFilters.assignedTo.length +
    (localFilters.searchQuery.length > 0 ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={localFilters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1"
        />
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="gap-2"
          >
            Clear all
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Horizontal Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground mr-1">Status:</span>
          {(["todo", "doing", "done"] as TaskStatus[]).map((status) => {
            const isActive = localFilters.statuses.includes(status);
            return (
              <Button
                key={status}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusToggle(status)}
                className="h-8"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            );
          })}
        </div>

        {/* Priority Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground mr-1">Priority:</span>
          {(["low", "medium", "high"] as TaskPriority[]).map((priority) => {
            const isActive = localFilters.priorities.includes(priority);
            return (
              <Button
                key={priority}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handlePriorityToggle(priority)}
                className="h-8"
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Button>
            );
          })}
        </div>

        {/* Assigned To Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm text-muted-foreground mr-1">Assigned:</span>
          <Button
            variant={localFilters.assignedTo.includes("__unassigned__") ? "default" : "outline"}
            size="sm"
            onClick={() => handleAssignedToToggle("__unassigned__")}
            className="h-8"
          >
            Unassigned
          </Button>
          {orgMembers.map((member) => {
            const isActive = localFilters.assignedTo.includes(member.user_id);
            return (
              <Button
                key={member.user_id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleAssignedToToggle(member.user_id)}
                className="h-8"
              >
                {member.profile.full_name || member.user_id}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
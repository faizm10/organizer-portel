"use client";

import { useState } from "react";
import { TasksFilters, type TaskFilters } from "@/components/tasks-filters";
import { TasksList } from "@/components/tasks-list";
import type { Task } from "@/lib/tasks";
import type { OrgMember } from "@/lib/org";

interface TasksPageContentProps {
  tasks: Task[];
  orgMembers: OrgMember[];
  orgId: string;
}

export function TasksPageContent({ tasks, orgMembers, orgId }: TasksPageContentProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    statuses: [],
    priorities: [],
    assignedTo: [],
    searchQuery: "",
  });

  return (
    <div className="space-y-4">
      <TasksFilters
        filters={filters}
        onFiltersChange={setFilters}
        orgMembers={orgMembers}
      />
      <TasksList
        tasks={tasks}
        orgMembers={orgMembers}
        orgId={orgId}
        filters={filters}
      />
    </div>
  );
}
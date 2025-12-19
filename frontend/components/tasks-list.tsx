"use client";

import { type Task } from "@/lib/tasks";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditTaskForm } from "@/components/edit-task-form";
import { DeleteTaskButton } from "@/components/delete-task-button";
import { format } from "date-fns";
import type { OrgMember } from "@/lib/org";

interface TasksListProps {
  tasks: Task[];
  orgMembers: OrgMember[];
  orgId: string;
}

const statusColors = {
  todo: "secondary",
  doing: "default",
  done: "outline",
} as const;

const priorityColors = {
  low: "secondary",
  medium: "default",
  high: "destructive",
} as const;

export function TasksList({ tasks, orgMembers, orgId }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Tasks</CardTitle>
          <CardDescription>
            Create your first task to get started with task management.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tasks</CardTitle>
        <CardDescription>
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[task.status]}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.priority ? (
                    <Badge variant={priorityColors[task.priority]}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.due_date ? (
                    <span className="text-sm">
                      {format(new Date(task.due_date), "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {task.assigned_to ? "Assigned" : "Unassigned"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditTaskForm task={task} orgMembers={orgMembers} orgId={orgId} />
                    <DeleteTaskButton task={task} orgId={orgId} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
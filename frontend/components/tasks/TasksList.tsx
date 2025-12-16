import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, AlertCircle } from "lucide-react";
import type { Task, TaskStatus, TaskPriority } from "@/lib/tasks";
import { formatDistanceToNow } from "date-fns";

type TasksListProps = {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
};

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  doing: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  done: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function TasksList({ tasks, onTaskClick }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-sm font-semibold">No tasks yet</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Create your first task to start organizing your hackathon workflow.
          </p>
          <Button size="sm" className="rounded-full">
            Create task
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
      ))}
    </div>
  );
}

function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick?: (task: Task) => void;
}) {
  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "done";

  return (
    <Card
      className={`cursor-pointer transition-all hover:border-border hover:shadow-sm ${
        onClick ? "" : "cursor-default"
      }`}
      onClick={() => onClick?.(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-2">
              <h3 className="flex-1 text-sm font-medium leading-tight">
                {task.title}
              </h3>
              <Badge
                variant="outline"
                className={`${statusColors[task.status]} shrink-0`}
              >
                {task.status}
              </Badge>
            </div>

            {task.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {task.priority && (
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <Badge
                    variant="outline"
                    className={`h-5 px-1.5 py-0 ${priorityColors[task.priority]}`}
                  >
                    {task.priority}
                  </Badge>
                </div>
              )}

              {task.due_date && (
                <div
                  className={`flex items-center gap-1.5 ${
                    isOverdue ? "text-red-600 dark:text-red-400" : ""
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  <span>
                    {isOverdue && "Overdue: "}
                    {formatDistanceToNow(new Date(task.due_date), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              )}

              {task.assigned_to && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  <span>Assigned</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


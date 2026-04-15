import type { ComponentProps } from "react";
import { useState } from "react";
import { useTaskDelete, useTaskGet } from "@/hooks/api/use-task";
import type { ITask } from "@/types/tasks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
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
import { CalendarDaysIcon, ClipboardListIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

function formatTaskDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

function humanizeStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function humanizePriority(priority: string) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function priorityBadgeVariant(priority: string): ComponentProps<typeof Badge>["variant"] {
  if (priority === "high") return "destructive";
  if (priority === "medium") return "secondary";
  return "outline";
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "border-emerald-500/25 bg-emerald-500/12 text-emerald-900 dark:text-emerald-200";
    case "in_progress":
      return "border-sky-500/25 bg-sky-500/12 text-sky-900 dark:text-sky-200";
    default:
      return "border-amber-500/25 bg-amber-500/10 text-amber-950 dark:text-amber-100";
  }
}

function TaskRow({
  task,
  onEdit,
  onRequestDelete,
}: {
  task: ITask;
  onEdit: (task: ITask) => void;
  onRequestDelete: (task: ITask) => void;
}) {
  return (
    <Card size="sm" className="transition-colors hover:bg-muted/40">
      <CardHeader className="gap-3 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="min-w-0 flex-1 text-base leading-snug">{task.title}</CardTitle>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
            <Badge variant={priorityBadgeVariant(task.priority)} className="capitalize">
              {humanizePriority(task.priority)}
            </Badge>
            <Badge variant="outline" className={cn("capitalize", statusBadgeClass(task.status))}>
              {humanizeStatus(task.status)}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Edit ${task.title}`}
              onClick={() => onEdit(task)}
            >
              <PencilIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Delete ${task.title}`}
              onClick={() => onRequestDelete(task)}
            >
              <Trash2Icon />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2 text-pretty">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDaysIcon className="size-3.5 shrink-0 opacity-70" aria-hidden />
            <span>Due {formatTaskDate(task.dueDate)}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TaskList({ onRequestEdit }: { onRequestEdit?: (task: ITask) => void }) {
  const { data, isLoading, isError, error } = useTaskGet({
    page: 1,
    limit: 10,
    sort: "dueDate",
    order: "ASC",
  });

  const { mutate: removeTask, isPending: isDeleting } = useTaskDelete();
  const [taskPendingDelete, setTaskPendingDelete] = useState<ITask | null>(null);

  const tasks = data?.data?.data;
  const meta = data?.data?.meta as { total?: number } | undefined;
  const list = Array.isArray(tasks) ? tasks : [];

  function confirmDelete() {
    if (!taskPendingDelete) return;
    const t = taskPendingDelete;
    removeTask(
      {
        id: t.id,
        callback: () => {
          setTaskPendingDelete(null);
          toast.success("Task deleted");
        },
      },
      {
        onError: () => toast.error("Could not delete task"),
      }
    );
  }

  if (isLoading) {
    return (
      <section className="space-y-4" aria-busy="true" aria-label="Loading tasks">
        <div className="flex items-center gap-2">
          <ClipboardListIcon className="size-5 text-muted-foreground" aria-hidden />
          <h2 className="font-heading text-lg font-medium">Tasks</h2>
        </div>
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 py-12">
          <Spinner className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your tasks…</p>
        </div>
      </section>
    );
  }

  if (isError) {
    const message =
      error && typeof error === "object" && "message" in error && typeof error.message === "string"
        ? error.message
        : "Something went wrong while loading tasks.";
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardListIcon className="size-5 text-muted-foreground" aria-hidden />
          <h2 className="font-heading text-lg font-medium">Tasks</h2>
        </div>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Couldn’t load tasks</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
        </Card>
      </section>
    );
  }

  return (
    <>
      <section className="mt-8 space-y-4" aria-label="Task list">
        <div className="flex flex-wrap items-end justify-end gap-2">
          <div className="flex items-center gap-2">
            <ClipboardListIcon className="size-5 text-muted-foreground" aria-hidden />
            <div>
              <h2 className="font-heading text-lg font-medium">Tasks</h2>
              <p className="text-sm text-muted-foreground">
                {list.length === 0
                  ? "No tasks yet"
                  : `${list.length}${meta?.total != null ? ` of ${meta.total}` : ""} task${list.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/15 px-6 py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/80 ring-1 ring-border/60">
              <ClipboardListIcon className="size-6 text-muted-foreground" aria-hidden />
            </div>
            <div className="max-w-sm space-y-1">
              <p className="font-medium text-foreground">You’re all caught up</p>
              <p className="text-sm text-muted-foreground">Create a task with the + button to see it listed here.</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {list.map((task) => (
              <li key={task.id}>
                <TaskRow
                  task={task}
                  onEdit={(t) => onRequestEdit?.(t)}
                  onRequestDelete={setTaskPendingDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <AlertDialog open={Boolean(taskPendingDelete)} onOpenChange={(open) => !open && setTaskPendingDelete(null)}>
        <AlertDialogContent className="z-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              {taskPendingDelete
                ? `“${taskPendingDelete.title}” will be removed. This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

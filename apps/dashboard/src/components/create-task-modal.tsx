import { useEffect, useState } from "react";
import { taskCreateSchema } from "@/zod/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { useTaskCreate, useTaskUpdate } from "@/hooks/api/use-task";
import type { ITask } from "@/types/tasks";

function formatDueDate(value: Date) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;
  return value.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DueDatePicker({
  value,
  onChange,
}: {
  value: Date;
  onChange: (date: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = formatDueDate(value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2 font-normal"
          aria-label={label ? `Due date: ${label}` : "Pick due date"}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-60" />
          <span className="truncate">{label ?? "Pick due date"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-60 w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setOpen(false);
            }
          }}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}

const defaultFormValues: z.infer<typeof taskCreateSchema> = {
  title: "",
  description: "",
  dueDate: new Date(),
  priority: "low",
  status: "pending",
};

export function CreateTaskModal({
  open,
  onOpenChange,
  taskToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: ITask | null;
}) {
  const { mutate: createTask, isPending: isPendingCreate } = useTaskCreate();
  const { mutate: updateTask, isPending: isPendingUpdate } = useTaskUpdate();
  const isPending = isPendingCreate || isPendingUpdate;
  const form = useForm<z.infer<typeof taskCreateSchema>>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: defaultFormValues,
  });
  const { reset } = form;

  useEffect(() => {
    if (!open) return;
    if (taskToEdit) {
      const due = new Date(taskToEdit.dueDate);
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: Number.isNaN(due.getTime()) ? new Date() : due,
        priority: taskToEdit.priority as z.infer<typeof taskCreateSchema>["priority"],
        status: taskToEdit.status as z.infer<typeof taskCreateSchema>["status"],
      });
    } else {
      reset(defaultFormValues);
    }
  }, [open, taskToEdit, reset]);

  function onSubmit(data: z.infer<typeof taskCreateSchema>) {
    if (taskToEdit) {
      updateTask(
        {
          id: taskToEdit.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate.toISOString(),
          priority: data.priority,
          status: data.status,
          callback: () => {
            onOpenChange(false);
            toast.success("Task updated");
          },
        },
        { onError: () => toast.error("Could not update task") }
      );
      return;
    }
    createTask(
      {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.toISOString(),
        priority: data.priority,
        status: data.status,
        callback: () => {
          onOpenChange(false);
          toast.success("Task created successfully");
        },
      },
      { onError: () => toast.error("Could not create task") }
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{taskToEdit ? "Edit task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input autoComplete="title" id="title" type="text" placeholder="Title" required {...field} />
                  <FieldError errors={[form.formState.errors.title]} />
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea className="h-40 resize-y" id="description" placeholder="Your task description" required {...field} />
                  <FieldError errors={[form.formState.errors.description]} />
                </Field>
              )}
            />
            <Controller
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                  <DueDatePicker value={field.value} onChange={field.onChange} />
                  <FieldError errors={[form.formState.errors.dueDate]} />
                </Field>
              )}
            />
            <FieldGroup className="flex flex-row gap-3">
              <Controller
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <Field className="min-w-0 flex-1">
                    <FieldLabel htmlFor="priority">Priority</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger id="priority" className="w-full" onBlur={field.onBlur} ref={field.ref}>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="z-100">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[form.formState.errors.priority]} />
                  </Field>
                )}
              />
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Field className="min-w-0 flex-1">
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger id="status" className="w-full" onBlur={field.onBlur} ref={field.ref}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="z-100">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[form.formState.errors.status]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldGroup>
          <FieldGroup className="mt-4">
            <Field>
              <Button type="submit" disabled={isPending}>
                {taskToEdit ? "Save changes" : "Create Task"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
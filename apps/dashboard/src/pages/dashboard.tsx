import { useState } from "react";
import useAuthStore from "@/stores/auth";
import { FloatingPlusButton } from "@/components/floating-plus-button";
import { CreateTaskModal } from "@/components/create-task-modal";
import { TaskList } from "@/components/task-list";
import type { ITask } from "@/types/tasks";

export default function DashboardPage() {
  const { data } = useAuthStore();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello, {data?.name}</p>
      <FloatingPlusButton
        onClick={() => {
          setTaskToEdit(null);
          setTaskModalOpen(true);
        }}
      />
      <CreateTaskModal
        open={taskModalOpen}
        onOpenChange={(open) => {
          setTaskModalOpen(open);
          if (!open) setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
      <TaskList
        onRequestEdit={(task) => {
          setTaskToEdit(task);
          setTaskModalOpen(true);
        }}
      />
    </div>
  );
}
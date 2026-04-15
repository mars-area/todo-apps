export interface ITask {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
}

export interface ITaskCreateData extends Omit<ITask, "id"> {
  callback: () => void;
}

export interface ITaskUpdateData extends ITask {
  callback: () => void;
}

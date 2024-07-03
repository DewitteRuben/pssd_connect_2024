export abstract class Task {
  protected uid: string;
  constructor(uid: string) {
    this.uid = uid;
  }

  async execute(): Promise<void> {}
}

export class TaskQueue {
  tasks: Task[];
  taskInProgress = false;

  constructor() {
    this.tasks = [];
  }

  queue(task: Task) {
    this.tasks.push(task);

    this.dequeue();
  }

  async dequeue() {
    if (this.taskInProgress) return;

    const task = this.tasks.shift();

    if (!task) return;

    try {
      this.taskInProgress = true;

      await task.execute();
    } catch (error) {
      console.error("Failed to execute task", error);
    } finally {
      this.taskInProgress = false;
      this.dequeue();
    }
  }
}

export const taskQueue = new TaskQueue();

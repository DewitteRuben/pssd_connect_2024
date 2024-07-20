export abstract class Task {
  protected uid: string;
  constructor(uid: string) {
    this.uid = uid;
  }

  async execute(): Promise<any> {}

  getUserId() {
    return this.uid;
  }
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

      const result = await task.execute();

      console.log(
        `Executed ${task.constructor.name} for user ${task.getUserId()} with result: ${result}` 
      );
    } catch (error) {
      console.error("Failed to execute task", error);
    } finally {
      this.taskInProgress = false;
      this.dequeue();
    }
  }
}

export const taskQueue = new TaskQueue();

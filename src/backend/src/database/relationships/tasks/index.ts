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

    return this.dequeue();
  }

  dequeue() {
    return new Promise((res, rej) => {
      if (this.taskInProgress) return;

      const task = this.tasks.shift();

      if (!task) return;

      this.taskInProgress = true;

      task
        .execute()
        .then((result) => {
          console.log(
            `Executed ${
              task.constructor.name
            } for user ${task.getUserId()} with result: ${JSON.stringify(result)}`
          );

          res(result);
        })
        .catch((error) => {
          console.error("Failed to execute task", error);
          rej(error);
        })
        .finally(() => {
          this.taskInProgress = false;
          this.dequeue();
        });
    });
  }
}

export const taskQueue = new TaskQueue();

import { getRelationships as getSuggestionsByRelationship } from "../../routes/helpers";
import { taskQueue } from "../relationships/tasks";
import { SuggestionTask } from "../relationships/tasks/suggestions";
import { Relationship } from "./types";

export class SuggestionManager {
  private activeSuggestionWorkers: Record<string, SuggestionWorker> = {};

  add(uid: string, callback?: (relationships: Relationship[]) => void) {
    if (this.activeSuggestionWorkers[uid]) {
      console.error("An active worker has already been found, removing...");

      this.remove(uid);
    }

    const worker = new SuggestionWorker(uid, callback);

    this.activeSuggestionWorkers[uid] = worker;

    worker.run();

    return worker;
  }

  refresh(uid: string) {
    const worker = this.activeSuggestionWorkers[uid];

    if (!worker) throw new Error("no active worker was found");

    worker.refresh();
  }

  remove(uid: string) {
    if (!this.activeSuggestionWorkers[uid]) {
      throw new Error("no active worker was found");
    }

    const worker = this.activeSuggestionWorkers[uid];
    worker.stop();

    delete this.activeSuggestionWorkers[uid];
  }

  get(uid: string) {
    return this.activeSuggestionWorkers[uid] ?? null;
  }
}

export class SuggestionWorker {
  private intervalinMS: number = 10_000;
  private workerProcess?: NodeJS.Timeout;
  private uid: string;
  private callback?: (relationships: Relationship[]) => void;

  constructor(uid: string, callback?: (relationships: Relationship[]) => void) {
    this.uid = uid;
    this.callback = callback;
  }

  async update() {
    await taskQueue.queue(new SuggestionTask(this.uid));
    const relationships = await getSuggestionsByRelationship(this.uid);

    return relationships;
  }

  async run() {
    this.workerProcess = setInterval(async () => {
      const suggestions = await this.update();

      if (this.callback) {
        this.callback(suggestions);
      }
    }, this.intervalinMS);
  }

  async refresh() {
    this.stop();

    await taskQueue.queue(new SuggestionTask(this.uid));

    const relationships = await getSuggestionsByRelationship(this.uid);

    if (this.callback) {
      this.callback(relationships);
    }

    this.run();
  }

  stop() {
    clearInterval(this.workerProcess);
  }
}

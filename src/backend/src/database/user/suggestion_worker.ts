import { getRelationships } from "../../routes/helpers";
import { Relationship } from "./types";

export class SuggestionManager {
  private activeSuggestionWorkers: Record<string, SuggestionWorker> = {};

  add(uid: string, callback?: (relationships: Relationship[]) => void) {
    if (this.activeSuggestionWorkers[uid]) {
      console.error("An active worker has already been found, removing...");

      this.remove(uid);
    }

    const worker = new SuggestionWorker(callback);

    this.activeSuggestionWorkers[uid] = worker;

    worker.execute(uid);

    return worker;
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
  private latestRelationships: Relationship[] = [];
  private callback?: (relationships: Relationship[]) => void;

  constructor(callback?: (relationships: Relationship[]) => void) {
    this.callback = callback;
  }

  async execute(uid: string) {
    this.workerProcess = setInterval(async () => {
      const relationships = await getRelationships(uid);
      if (this.callback) {
        this.callback(relationships);
      }

      this.latestRelationships = relationships;
    }, this.intervalinMS);
  }

  getResults() {
    return this.latestRelationships;
  }

  stop() {
    clearInterval(this.workerProcess);
  }
}

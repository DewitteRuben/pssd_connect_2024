import { makeAutoObservable, reaction, runInAction } from "mobx";
import { RootStore } from "./store";
import { Relationship } from "../backend/src/database/user/types.js";
import pssdsAPI from "../api/pssds";
import _ from "lodash";

export class RelationshipStore {
  private root: RootStore;
  private initialized: boolean;

  public relationships: Relationship | null;

  constructor(root: RootStore) {
    this.root = root;
    this.initialized = false;
    this.relationships = null;

    makeAutoObservable(this);

    reaction(
      () => this.root.auth.user,
      () => {
        this.fetchRelationships();
      }
    );

    setInterval(() => {
      this.fetchRelationships();
    }, 300000);
  }

  get isInitialized() {
    return this.initialized;
  }

  get exists() {
    return this.initialized && this.relationships !== null;
  }

  async fetchRelationships() {
    const firebaseUID = this.root.auth.user?.uid;

    if (!firebaseUID) {
      runInAction(() => {
        this.initialized = true;
        this.relationships = null;
      });
      return;
    }

    try {
      const { success, message, result } = await pssdsAPI.getSuggestions(firebaseUID);
      if (success) {
        runInAction(() => {
          this.relationships = result;
        });
        return;
      }

      throw new Error(message);
    } catch (error) {
      console.warn("Failed to get user", error);
    } finally {
      runInAction(() => {
        this.initialized = true;
      });
    }
  }
}

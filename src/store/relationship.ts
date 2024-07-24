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

  async like(likedUser: string) {
    const firebaseUID = this.root.auth.user?.uid;

    if (!firebaseUID) return;

    try {
      const { success, message } = await pssdsAPI.likeUser(firebaseUID, likedUser);
      if (success) {
        return;
      }

      throw new Error(message);
    } catch (error) {
      console.warn("Failed to get user", error);
    }
  }

  async dislike(dislikedUser: string) {
    const firebaseUID = this.root.auth.user?.uid;

    if (!firebaseUID) return;

    try {
      const { success, message } = await pssdsAPI.dislikeUser(firebaseUID, dislikedUser);
      if (success) {
        return;
      }

      throw new Error(message);
    } catch (error) {
      console.warn("Failed to get user", error);
    }
  }

  async unmatch(unmatchUserUid: string) {
    const firebaseUID = this.root.auth.user?.uid;

    if (!firebaseUID) return;

    try {
      const { success, message } = await pssdsAPI.unmatchUser(
        firebaseUID,
        unmatchUserUid
      );
      if (success) {
        return;
      }

      throw new Error(message);
    } catch (error) {
      console.warn("Failed to get user", error);
    }
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

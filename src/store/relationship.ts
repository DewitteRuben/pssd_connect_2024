import _ from "lodash";
import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import { RootStore } from "./store";
import { Relationship } from "../backend/src/database/user/types.js";
import pssdsAPI from "../api/pssds";

export class RelationshipStore {
  private root: RootStore;
  private initialized: boolean;
  private suggestionIndex: number = 0;
  public relationships: Relationship | null;

  constructor(root: RootStore) {
    this.root = root;
    this.initialized = false;
    this.relationships = null;

    makeAutoObservable(this);

    reaction(
      () => this.root.auth.user,
      () => {
        this.initRelationshipEvents();
      }
    );
  }

  get isInitialized() {
    return this.initialized;
  }

  get exists() {
    return this.initialized && this.relationships !== null;
  }

  get index() {
    return this.suggestionIndex;
  }

  updateIndex(updatedIndex: number) {
    this.suggestionIndex = updatedIndex;
  }

  clear() {
    this.relationships = null;
  }

  get currentSuggestion() {
    return this.relationships?.suggestions_info[this.suggestionIndex];
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

  async initRelationshipEvents() {
    const firebaseUID = this.root.auth.user?.uid;

    if (!firebaseUID || pssdsAPI.eventsInitialized) {
      runInAction(() => {
        this.relationships = null;
      });
      return;
    }

    try {
      await pssdsAPI.setupSuggestionEvents(firebaseUID, async (data) => {
        const { success, message, result } = data;
        if (success) {
          runInAction(() => {
            const updateIndex = !_.isEqual(result, toJS(this.relationships));

            this.relationships = result;

            if (this.relationships && updateIndex) {
              this.suggestionIndex = this.relationships.suggestions_info.length - 1;
            }
          });
          return;
        }

        throw new Error(message);
      });
    } catch (error) {
      console.warn("Failed to get user", error);
    } finally {
      runInAction(() => {
        this.initialized = true;
      });
    }
  }
}

import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import { RootStore } from "./store";
import { User } from "../backend/src/database/user/user";
import pssdsAPI from "../api/pssds";

export class UserStore {
  private root: RootStore;
  private initialized: boolean;

  public user: User | null;

  constructor(root: RootStore) {
    this.root = root;
    this.initialized = false;
    this.user = null;

    makeAutoObservable(this);

    reaction(
      () => this.root.auth.user,
      () => {
        this.updateUser();
      }
    );
  }

  get isInitialized() {
    return this.initialized;
  }

  get exists() {
    return this.initialized && this.user !== null;
  }

  async updateUser() {
    const firebaseUID = this.root.auth.user?.uid;

    if (!firebaseUID) {
      runInAction(() => {
        this.initialized = true;
        this.user = null;
      });
      return;
    }

    try {
      const { success, message, result } = await pssdsAPI.getUser(firebaseUID);
      if (success) {
        runInAction(() => {
          this.user = result;
        });

        return
      }

      throw new Error(message)
    } catch (error) {
      console.warn("Failed to get user", error);
    } finally {
      runInAction(() => {
        this.initialized = true;
      });
    }
  }
}

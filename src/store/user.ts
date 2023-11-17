import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import { RootStore } from "./store";
import { User } from "../backend/src/database/user/user";
import pssdsAPI from "../api/pssds";
import { RecursivePartial } from "../types/global";
import _ from "lodash";

export class UserStore {
  private root: RootStore;
  private initialized: boolean;

  public user: User | null;

  private remoteUpdateTask?: Promise<any>;

  constructor(root: RootStore) {
    this.root = root;
    this.initialized = false;
    this.user = null;

    makeAutoObservable(this);

    reaction(
      () => this.root.auth.user,
      () => {
        this.fetchUser();
      }
    );
  }

  get isInitialized() {
    return this.initialized;
  }

  get exists() {
    return this.initialized && this.user !== null;
  }

  private async updateRemoteUser() {
    if (!this.user) return;

    // make sure previous task is done before doing next
    if (this.remoteUpdateTask) {
      await this.remoteUpdateTask;
    }

    try {
      this.remoteUpdateTask = pssdsAPI.updateUser(this.user);
      await this.remoteUpdateTask;
    } catch (error) {
    } finally {
      this.remoteUpdateTask = undefined;
    }
  }

  updateUser(userPayload: RecursivePartial<User>) {
    this.user = _.merge(this.user, userPayload);
    return this.updateRemoteUser();
  }

  async fetchUser() {
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

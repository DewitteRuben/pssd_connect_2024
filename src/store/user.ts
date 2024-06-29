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

  private async deleteRemoteUser() {
    if (!this.user) return;

    try {
      this.remoteUpdateTask = pssdsAPI.deleteUser(this.user.uid);
    } catch (error) {
      console.error("Failed to delete remote user", error);
    }
  }

  updateUser(userPayload: RecursivePartial<User>) {
    this.user = _.mergeWith({}, this.user, userPayload, (a, b) =>
      _.isArray(b) ? b : undefined
    );

    return this.updateRemoteUser();
  }

  async deleteUser() {
    this.root.registration.deleteStoredData();

    return this.deleteRemoteUser();
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

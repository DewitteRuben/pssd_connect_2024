import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import { User } from "../backend/src/database/user/types";
import { RootStore } from "./store";
import pssdsAPI from "../api/pssds";
import { RecursivePartial } from "../types/global";
import _ from "lodash";

export class UserStore {
  private root: RootStore;
  private initialized: boolean;
  private loading: boolean = false;

  public user: User | null;

  private remoteUpdateTask?: Promise<any>;

  constructor(root: RootStore) {
    this.root = root;
    this.initialized = false;
    this.loading = false;
    this.user = null;

    makeAutoObservable(this);

    reaction(
      () => this.root.auth.user,
      () => {
        this.fetchUserMetadata();
      }
    );
  }

  get isInitialized() {
    return this.initialized;
  }

  get isLoading() {
    return this.loading;
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
      console.error("Failed to update remote user", error);
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

  async fetchUserMetadata() {
    const firebaseUID = this.root.auth.user?.uid;

    runInAction(() => {
      this.loading = true;
    });

    if (!firebaseUID) {
      runInAction(() => {
        this.initialized = true;
        this.loading = false;
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
        this.loading = false;
      });
    }
  }
}

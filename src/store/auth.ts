import { action, makeAutoObservable, runInAction } from "mobx";
import { firebaseAuth } from "../firebase/firebase";
import {
  User,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React from "react";

export class AuthStore {
  public user: User | null;
  private ready: boolean;

  constructor() {
    this.user = null;
    this.ready = false;

    makeAutoObservable(this);

    firebaseAuth.setPersistence(browserLocalPersistence);
    firebaseAuth.onAuthStateChanged(
      (user) =>
        runInAction(() => {
          this.user = user;
          this.ready = true;
        }),
      (err) => {
        console.error(err);
      }
    );
  }

  get loggedIn() {
    return this.user !== null;
  }

  get isReady() {
    return this.ready;
  }

  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }
}

const authStore = new AuthStore();

export const AuthStoreContext = React.createContext(authStore);

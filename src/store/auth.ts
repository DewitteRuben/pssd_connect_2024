import { makeAutoObservable, runInAction } from "mobx";
import { firebaseAuth } from "../firebase/firebase";
import {
  AuthError,
  AuthErrorCodes,
  ConfirmationResult,
  PhoneAuthProvider,
  RecaptchaVerifier,
  User,
  browserLocalPersistence,
  linkWithPhoneNumber,
  createUserWithEmailAndPassword,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import React from "react";

export class AuthStore {
  public user: User | null;
  private ready: boolean;
  static RECAPTCHA_CONTAINER = "recaptcha-container";
  private confirmationResult: ConfirmationResult | null;
  private captchaVerifier: RecaptchaVerifier;

  constructor() {
    this.user = null;
    this.ready = false;
    this.confirmationResult = null;
    this.captchaVerifier = new RecaptchaVerifier(
      firebaseAuth,
      AuthStore.RECAPTCHA_CONTAINER,
      {
        size: "invisible",
      }
    );

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

  get hasConfirmationResult() {
    return !!this.confirmationResult;
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  }

  async confirmVerification(code: string) {
    if (!this.confirmationResult) throw new Error("no confirmation result found");

    try {
      await this.confirmationResult.confirm(code);

      return { success: true };
    } catch (e) {
      const err = e as AuthError;
      console.error("Failed to verify phone number", err);

      let message;
      switch (err.code) {
        case AuthErrorCodes.NEED_CONFIRMATION: {
          message = "phoneNumberAlreadyLinkedToAnotherAccount";
          break;
        }
      }

      return { success: false, message };
    } finally {
      runInAction(() => {
        this.confirmationResult = null;
      });
    }
  }

  async verifyPhoneNumber(countryCode: string, phoneNumber: string) {
    if (!this.user) {
      throw new Error("user is not defined while attempting to link credential");
    }

    try {
      const confirmationResult = await linkWithPhoneNumber(
        this.user,
        `${countryCode}${phoneNumber}`,
        this.captchaVerifier
      );

      runInAction(() => {
        this.confirmationResult = confirmationResult;
      });

      return { success: true };
    } catch (e) {
      const err = e as AuthError;
      console.error("Failed to verify phone number", err);

      let message;
      switch (err.code) {
        case AuthErrorCodes.INVALID_PHONE_NUMBER: {
          message = "invalidPhoneNumber";
          break;
        }
      }

      return { success: false, message };
    }
  }
}

const authStore = new AuthStore();

export const AuthStoreContext = React.createContext(authStore);

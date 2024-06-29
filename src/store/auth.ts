import { makeAutoObservable, runInAction } from "mobx";
import { firebaseAuth } from "../firebase/firebase";
import {
  AuthError,
  AuthErrorCodes,
  ConfirmationResult,
  RecaptchaVerifier,
  User,
  browserLocalPersistence,
  linkWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { RootStore } from "./store";
import pssdsAPI from "../api/pssds";

export class AuthStore {
  public user?: User | null;
  private ready: boolean;
  static RECAPTCHA_CONTAINER = "recaptcha-container";
  private confirmationResult: ConfirmationResult | null;
  private captchaVerifier: RecaptchaVerifier;
  private root: RootStore;

  constructor(root: RootStore) {
    this.root = root;
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
          pssdsAPI.setFirebaseUser(user);

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

  logout() {
    return firebaseAuth.signOut();
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

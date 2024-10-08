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
import { DatabaseError } from "../backend/src/errors";

export class AuthStore {
  public user?: User | null;
  private ready: boolean;
  private loggingIn: boolean = false;

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
      (user) => {
        pssdsAPI.setFirebaseUser(user);

        runInAction(() => {
          this.user = user;
          this.ready = true;
        });
      },
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

  get isLoggingIn() {
    return this.loggingIn;
  }

  logout() {
    return firebaseAuth.signOut();
  }

  async signIn(email: string, password: string) {
    runInAction(() => {
      this.loggingIn = true;
    });

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      await this.root.user.fetchUserMetadata();

      return { success: true };
    } catch (e) {
      const err = e as AuthError & DatabaseError;

      let message;
      switch (err.code) {
        case AuthErrorCodes.INVALID_PASSWORD:
        case AuthErrorCodes.USER_DELETED:
          message = "The email address or password you have entered is invalid";
          break;
      }

      if (err.shortcode === "auth/user-not-found") {
        message = "The user you attempted to log in as does not exist";
      }

      return { success: false, message };
    } finally {
      runInAction(() => {
        this.loggingIn = false;
      });
    }
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
          message = "This phone number is already linked to another account";
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
          message = "The phone number is invalid";
          break;
        }
      }

      return { success: false, message };
    }
  }
}

import { RecaptchaVerifier } from "firebase/auth";
import { RootStore } from "../store/store";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    grecaptcha: any;
    RootStore: RootStore;
  }
}

export {};

import { RecaptchaVerifier } from "firebase/auth";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    grecaptcha: any;
  }
}

export {};

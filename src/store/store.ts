import { createContext, useContext } from "react";
import { AuthStore } from "./auth";
import { RegistrationStore } from "./registration";
import { UserStore } from "./user";

export class RootStore {
  auth: AuthStore;
  registration: RegistrationStore;
  user: UserStore;

  constructor() {
    this.auth = new AuthStore(this);
    this.registration = new RegistrationStore(this);
    this.user = new UserStore(this);
  }
}

const rootStore = new RootStore();

// @ts-ignore
window.RootStore = rootStore;

export const StoreContext = createContext(rootStore);
export const useStore = () => useContext(StoreContext);

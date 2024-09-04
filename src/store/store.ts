import { createContext, useContext } from "react";
import { AuthStore } from "./auth";
import { RegistrationStore } from "./registration";
import { UserStore } from "./user";
import { RelationshipStore } from "./relationship";

export class RootStore {
  auth: AuthStore;
  registration: RegistrationStore;
  user: UserStore;
  relationship: RelationshipStore;

  constructor() {
    this.auth = new AuthStore(this);
    this.registration = new RegistrationStore(this);
    this.user = new UserStore(this);
    this.relationship = new RelationshipStore(this);
  }
}

const rootStore = new RootStore();

window.RootStore = rootStore;

export const StoreContext = createContext(rootStore);
export const useStore = () => useContext(StoreContext);

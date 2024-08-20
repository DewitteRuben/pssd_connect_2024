import _ from "lodash";
import { makeAutoObservable } from "mobx";
import { RootStore } from "./store";
import { getMessaging, onMessage } from "firebase/messaging";

export class MessageStore {
  private root: RootStore;

  constructor(root: RootStore) {
    this.root = root;

    makeAutoObservable(this);

    const messaging = getMessaging();

    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
    });

    console.log("OK?");
  }
}

import { makeAutoObservable } from "mobx";
import React from "react";

const registrationFlow = [
  "email",
  "phone",
  "name",
  "birthdate",
  "gender",
  "showme",
  "pssd-duration",
  "photos",
] as const;
type Step = (typeof registrationFlow)[number];

export class RegistrationStore {
  public finishedRegistration = false;
  public step: Step = "photos";

  private userData: Record<string, any> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setData(key: string, value: any) {
    this.userData[key] = value;
  }

  nextStep() {
    const curIndex = registrationFlow.indexOf(this.step);

    if (curIndex + 2 > registrationFlow.length) {
      throw new Error("no more steps left in registration flow");
    }

    this.setStep(registrationFlow[curIndex + 1] as Step);
  }

  setStep(step: Step) {
    this.step = step;
  }
}

const registrationStore = new RegistrationStore();

export const RegistrationStoreContext = React.createContext(registrationStore);

import { makeAutoObservable } from "mobx";
import { autoSave } from "./localstorage";
import pssdsAPI from "../api/pssds";
import { User } from "../backend/src/database/user/user";
import { RootStore } from "./store";

export type Step =
  | "email"
  | "phone"
  | "name"
  | "birthdate"
  | "gender"
  | "mode"
  | "showme"
  | "pssd-duration"
  | "photos"
  | "location";

export type Mode = "dating" | "friends";

type UserWithoutUID = Partial<Omit<User, "uid">>;

export class RegistrationStore {
  private root: RootStore;
  public mode: Mode = "dating";
  public step: Step = "email";

  private registrationData: UserWithoutUID = {
    completedRegistration: false,
  };

  private registrationFlow = [
    { step: "email", datingOnly: false, goBack: false, done: false },
    { step: "phone", datingOnly: false, goBack: false, done: false },
    { step: "name", datingOnly: false, goBack: true, done: false },
    { step: "birthdate", datingOnly: false, goBack: true, done: false },
    { step: "gender", datingOnly: false, goBack: true, done: false },
    { step: "mode", datingOnly: false, goBack: true, done: false },
    { step: "showme", datingOnly: true, goBack: true, done: false },
    { step: "pssd-duration", datingOnly: false, goBack: true, done: false },
    { step: "photos", datingOnly: false, goBack: true, done: false },
    { step: "location", datingOnly: false, goBack: true, done: false },
  ];

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
    autoSave(this, "registration");
  }

  getData(key: keyof UserWithoutUID) {
    return this.registrationData[key];
  }

  setData(key: keyof UserWithoutUID, value: any) {
    this.registrationData[key] = value;
  }

  setMode(mode: Mode) {
    this.mode = mode;
  }

  getFirstUnfinishedStep() {
    return this.registrationFlow
      .filter((rf) => {
        if (this.mode !== "dating" && rf.datingOnly) return false;
        return true;
      })
      .find((rf) => !rf.done);
  }

  getStep(step: Step) {
    return this.registrationFlow.find((rf) => rf.step === step);
  }

  canStep(step: Step) {
    const indexOfStep = this.registrationFlow.findIndex((rf) => rf.step === step);
    const prevStep = this.registrationFlow[indexOfStep - 1];
    if (!prevStep) return true;

    return prevStep.done;
  }

  async finishRegistration() {
    this.setData("completedRegistration", true);

    const curStep = this.registrationFlow.find((rf) => rf.step === this.step);
    if (curStep) {
      curStep.done = true;
    }

    const user = this.root.auth.user;
    if (!user) {
      throw new Error("Firebase user was not found, invalid state!");
    }

    const newUser = {
      uid: user.uid,
      ...this.registrationData,
    } as User;

    return pssdsAPI.createUser(newUser);
  }

  get isFinished() {
    return this.registrationData.completedRegistration;
  }

  nextStep() {
    const curIndex = this.registrationFlow.findIndex((rf) => rf.step === this.step);

    let index = curIndex + 1;
    let nextStep = this.registrationFlow.at(index);
    if (this.mode !== "dating") {
      while (nextStep?.datingOnly) {
        nextStep = this.registrationFlow.at(index + 1);
        index++;
      }
    }

    if (!nextStep) {
      throw new Error("no more steps left in registration flow");
    }

    this.registrationFlow[curIndex].done = true;

    this.setStep(nextStep.step as Step);

    return nextStep;
  }

  setStep(step: Step) {
    this.step = step;
  }
}

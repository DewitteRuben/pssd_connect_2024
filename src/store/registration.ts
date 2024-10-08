import { makeAutoObservable, runInAction } from "mobx";
import { autoSave } from "./localstorage";
import pssdsAPI from "../api/pssds";
import { User } from "../backend/src/database/user/types";
import { RootStore } from "./store";
import { RecursivePartial } from "../types/global";
import _ from "lodash";
import { differenceInYears } from "date-fns";

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
  | "location"
  | "notification";

export type Mode = "dating" | "friends";

type UserWithoutUID = Omit<User, "uid">;
type OptionalUserWithoutUID = RecursivePartial<UserWithoutUID>;

const initRegistrationFlow = () => {
  return [
    { step: "email", datingOnly: false, goBack: true, done: false, cancelable: false },
    { step: "phone", datingOnly: false, goBack: false, done: false, cancelable: true },
    { step: "name", datingOnly: false, goBack: false, done: false, cancelable: true },
    { step: "birthdate", datingOnly: false, goBack: true, done: false, cancelable: true },
    { step: "gender", datingOnly: false, goBack: true, done: false, cancelable: true },
    { step: "mode", datingOnly: false, goBack: true, done: false, cancelable: true },
    { step: "showme", datingOnly: true, goBack: true, done: false, cancelable: true },
    {
      step: "pssd-duration",
      datingOnly: false,
      goBack: true,
      done: false,
      cancelable: true,
    },
    { step: "photos", datingOnly: false, goBack: true, done: false, cancelable: true },
    { step: "location", datingOnly: false, goBack: true, done: false, cancelable: true },
    {
      step: "notification",
      datingOnly: false,
      goBack: true,
      done: false,
      cancelable: true,
    },
  ];
};

const initRegistrationData = () => {
  return {
    registrationInProgress: false,
    completedRegistration: false,
    preferences: {
      genderPreference: "women",
    },
  } as OptionalUserWithoutUID;
};

const REGISTRATION_LOCALSTORAGE_KEY = "registration";

export class RegistrationStore {
  private root: RootStore;
  public mode: Mode = "dating";
  public step: Step = "email";

  public registrationData: OptionalUserWithoutUID = initRegistrationData();

  private registrationFlow = initRegistrationFlow();

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
    autoSave(this, REGISTRATION_LOCALSTORAGE_KEY);
    this.updateRegistrationFlow();
  }

  getData(key: keyof OptionalUserWithoutUID) {
    return this.registrationData[key];
  }

  deleteStoredData() {
    localStorage.removeItem(REGISTRATION_LOCALSTORAGE_KEY);
  }

  reset() {
    this.registrationData = initRegistrationData();
    this.registrationFlow = initRegistrationFlow();
  }

  async cancel() {
    if (this.root.auth.user) {
      return pssdsAPI
        .cancelRegistration(this.root.auth.user.uid)
        .then(() => this.reset());
    }
  }

  updateRegistrationFlow() {
    const updatedFlow = initRegistrationFlow();

    const mergedData = updatedFlow.map((updatedStep) => {
      const originalStep = this.registrationFlow.find(
        (orig) => orig.step === updatedStep.step
      );

      return { ...updatedStep, done: originalStep ? originalStep.done : false };
    });

    this.registrationFlow = mergedData;
  }

  updateRegistrationData(payload: OptionalUserWithoutUID) {
    this.registrationData = _.merge(this.registrationData, payload);
  }

  setMode(mode: Mode) {
    this.mode = mode;
  }

  getFirstUnfinishedStep() {
    return this.registrationFlow.find((rf) => !rf.done);
  }

  getStep(step: Step) {
    return this.registrationFlow.find((rf) => rf.step === step);
  }

  getPreviousStep(step: Step) {
    const indexOfCurStep = this.registrationFlow.findIndex((rf) => rf.step === step);

    if (indexOfCurStep - 1 < 0) {
      return null;
    }

    return this.registrationFlow[indexOfCurStep - 1];
  }

  getNextStep(step: Step) {
    const indexOfCurStep = this.registrationFlow.findIndex((rf) => rf.step === step);

    if (indexOfCurStep + 1 >= this.registrationFlow.length) {
      return null;
    }

    return this.registrationFlow[indexOfCurStep + 1];
  }

  canStep(step: Step) {
    const indexOfStep = this.registrationFlow.findIndex((rf) => rf.step === step);
    const prevStep = this.registrationFlow[indexOfStep - 1];
    if (!prevStep) return true;

    return prevStep.done;
  }

  async finish() {
    // calculate max and min age difference using the half-your-age-plus-7 rule
    const birthdate = this.registrationData.birthdate!;
    const age = differenceInYears(new Date(), new Date(birthdate as string));
    const ageStart = Math.floor(age / 2) + 7;
    const ageEnd = (age - 7) * 2;

    this.updateRegistrationData({
      completedRegistration: true,
      preferences: { ageStart, ageEnd },
    });

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

    const { success } = await pssdsAPI.createUser(newUser);
    if (!success) {
      // TODO: handle this more
      throw new Error("failed to create account!!!");
    }

    this.reset();

    return this.root.user.fetchUserMetadata();
  }

  get isFinished() {
    return this.registrationData.completedRegistration;
  }

  get isInProgress() {
    return this.registrationData.registrationInProgress;
  }

  nextStep() {
    if (!this.registrationData.registrationInProgress) {
      this.updateRegistrationData({ registrationInProgress: true });
    }

    const curIndex = this.registrationFlow.findIndex((rf) => rf.step === this.step);

    let index = curIndex + 1;
    let nextStep = this.registrationFlow[index];
    if (this.mode !== "dating") {
      while (nextStep?.datingOnly) {
        nextStep = this.registrationFlow[index + 1];
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

import { makeAutoObservable } from "mobx";
import { autoSave } from "./localstorage";
import pssdsAPI from "../api/pssds";
import { User } from "../backend/src/database/user/user";
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
  | "location";

export type Mode = "dating" | "friends";

type UserWithoutUID = Omit<User, "uid">;
type OptionalUserWithoutUID = RecursivePartial<UserWithoutUID>;

export class RegistrationStore {
  private root: RootStore;
  public mode: Mode = "dating";
  public step: Step = "email";

  public registrationData: OptionalUserWithoutUID = {
    completedRegistration: false,
    preferences: {
      genderPreference: "women",
    },
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

  getData(key: keyof OptionalUserWithoutUID) {
    return this.registrationData[key];
  }

  updateRegistrationData(payload: OptionalUserWithoutUID) {
    this.registrationData = _.merge(this.registrationData, payload);
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

  async finish() {
    // calculate max and min age difference using the half-your-age-plus-7 rule
    const age = differenceInYears(new Date(), this.registrationData.birthdate! as Date);
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

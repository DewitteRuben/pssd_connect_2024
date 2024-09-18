export type UserProfile = {
  school: string;
  jobTitle: string;
  about: string;
  company: string;
  city: string;
};

export type UserPSSDInfo = {
  duration: PSSDDuration;
  symptoms: string[];
  medications: string[];
};

export type UserPreferences = {
  genderPreference: GenderPreference;
  showAge: boolean;
  ageStart: number;
  ageEnd: number;
  maxDistance: number;
  global: boolean;
  showDistance: boolean;
  showMe: boolean;
};

export type UserLocation = {
  type: "Point";
  coordinates: number[];
};

export const relationshipMode = ["dating", "friends"] as const;
export const genderPreferences = ["men", "women", "everyone"] as const;
export const distanceUnits = ["km", "mi"] as const;

export type RelationshipMode = (typeof relationshipMode)[number];
export type Gender = "man" | "woman" | "other";
export type GenderPreference = (typeof genderPreferences)[number];
export type DistanceUnit = (typeof distanceUnits)[number];

export type Relationship = {
  uid: string;
  suggestions: string[];
  suggestions_info: {
    uid: string;
    firstName: string;
    birthdate: string;
    images: string[];
    distance: number;
    profile: UserProfile;
    pssd: UserPSSDInfo;
  }[];
  likes: string[];
  dislikes: string[];
  matches: string[];
};

export type User = {
  uid: string;
  idToken: string;
  chatToken: string;
  country?: string;
  city?: string;
  notificationToken: string;
  email: string;
  completedRegistration: boolean;
  registrationInProgress: boolean;
  countryCode: string;
  phoneNumber: string;
  firstName: string;
  birthdate: string | Date;
  gender: Gender;
  distanceUnit?: DistanceUnit;
  mode: RelationshipMode;
  profile: UserProfile;
  preferences: UserPreferences;
  pssd: UserPSSDInfo;
  images: string[];
  location: UserLocation;
};

const durationToPrettyDuration = {
  "3to6months": "3 – 6 months",
  "6to12months": "6 – 12 months",
  "1to2years": "1 – 2 years",
  "3to5years": "3 – 5 years",
  "5to10years": "5 – 10 years",
  morethan10years: "10+ years",
};

export type PSSDDuration = keyof typeof durationToPrettyDuration;

export const prettyPSSDDuration = (duration: PSSDDuration) => {
  return durationToPrettyDuration[duration];
};

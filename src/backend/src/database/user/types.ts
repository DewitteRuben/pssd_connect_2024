export type UserProfile = {
  school: string;
  jobTitle: string;
  about: string;
  company: string;
  city: string;
};

export type UserPSSDInfo = {
  duration: string;
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
  country?: string;
  city?: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
};

export type Gender = "man" | "woman" | "other";
export type GenderPreference = "men" | "women" | "everyone";

export type Relationship = {
  uid: string;
  suggestions: string[];
  suggestions_info: {
    uid: string;
    firstName: string;
    birthdate: string;
    images: string[];
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
  email: string;
  completedRegistration: boolean;
  registrationInProgress: boolean;
  countryCode: string;
  phoneNumber: string;
  firstName: string;
  birthdate: string | Date;
  gender: Gender;
  mode: string;
  profile: UserProfile;
  preferences: UserPreferences;
  pssd: UserPSSDInfo;
  images: string[];
  location: UserLocation;
};

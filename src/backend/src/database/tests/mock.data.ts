import { User } from "../user/user";

export const mockUser1: User = {
  uid: "1",
  chatToken: "",
  idToken: "",
  email: "rubendewitte1998@gmail.com",
  completedRegistration: true,
  countryCode: "+49",
  phoneNumber: "17647121329",
  firstName: "Ruben",
  birthdate: "2000-01-01T00:00:00.000Z",
  gender: "man",
  mode: "dating",
  images: [
    "https://firebasestorage.googleapis.com/v0/b/pssd-app.appspot.com/o/75mhuQKLmOPI1yFJxYJH9vNF63l1%2Fimages%2F6e8a488e-17b3-4e6b-9899-7ea5a826857b-colajpg?alt=media&token=89dc5c23-584c-4348-9061-18fbecb3a1e7",
  ],
  preferences: {
    genderPreference: "women",
    ageStart: 18,
    ageEnd: 40,
    showAge: true,
    maxDistance: 100,
    global: true,
    showDistance: true,
    showMe: true,
  },
  registrationInProgress: false,
  profile: { school: "", jobTitle: "", about: "", company: "", city: "" },
  pssd: { duration: "3to5years", symptoms: [], medications: [] },
  location: {
    coords: { latitude: 50.1083114, longitude: 8.7500944 },
    timestamp: 1700701949517,
  },
};

export const mockUser2: User = {
  uid: "2",
  chatToken: "",
  idToken: "",
  email: "bobientje+2@gmail.com",
  completedRegistration: true,
  countryCode: "+49",
  phoneNumber: "17647121329",
  firstName: "Bobientje2",
  birthdate: "2000-01-01T00:00:00.000Z",
  gender: "woman",
  mode: "dating",
  images: [
    "https://firebasestorage.googleapis.com/v0/b/pssd-app.appspot.com/o/75mhuQKLmOPI1yFJxYJH9vNF63l1%2Fimages%2F6e8a488e-17b3-4e6b-9899-7ea5a826857b-colajpg?alt=media&token=89dc5c23-584c-4348-9061-18fbecb3a1e7",
  ],
  preferences: {
    genderPreference: "men",
    ageStart: 18,
    ageEnd: 40,
    showAge: true,
    maxDistance: 20,
    global: true,
    showDistance: true,
    showMe: true,
  },
  registrationInProgress: false,
  profile: { school: "", jobTitle: "", about: "", company: "", city: "" },
  pssd: { duration: "3to5years", symptoms: [], medications: [] },
  location: {
    coords: {
      latitude: 50.54740168377306,
      longitude: 8.7500944,
    },
    timestamp: 1700701949517,
  },
};

export const mockUsers: User[] = [mockUser1, mockUser2];

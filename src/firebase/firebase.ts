import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { isSupported } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyA3-pw6utfIFyi1yDC7qHIlyj33g-TAJDQ",
  authDomain: "pssd-app.firebaseapp.com",
  databaseURL: "https://pssd-app-default-rtdb.firebaseio.com",
  projectId: "pssd-app",
  storageBucket: "pssd-app.appspot.com",
  messagingSenderId: "141538485092",
  appId: "1:141538485092:web:76fb20bbbe96bc6c649071",
  measurementId: "G-T1N612GH4R",
};

const app = initializeApp(firebaseConfig);

// Need to use initializeAuth to fix iframe error on Safari, see https://stackoverflow.com/questions/69197475/firebase-auth-breaks-with-cross-origin-isolation-i-e-when-using-cross-origin-r
export const firebaseAuth = initializeAuth(app, {
  persistence: [
    indexedDBLocalPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
  ],
});

export const isMessagingSupported = isSupported;

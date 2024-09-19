import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyAQWJdRvxFJxZu2HWgOQfPpwVr98bgqNLU",
  authDomain: "pssd-connect-demo.firebaseapp.com",
  projectId: "pssd-connect-demo",
  storageBucket: "pssd-connect-demo.appspot.com",
  messagingSenderId: "22704590714",
  appId: "1:22704590714:web:575c320d5d9b36b22710c3"
};

const app = initializeApp(firebaseConfig);

// Need to use initializeAuth to fix iframe error on Safari, see: https://stackoverflow.com/questions/69197475/firebase-auth-breaks-with-cross-origin-isolation-i-e-when-using-cross-origin-r
export const firebaseAuth = initializeAuth(app, {
  persistence: [
    indexedDBLocalPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
  ],
});

export const isMessagingSupported = isSupported;
export const messaging = getMessaging(app);
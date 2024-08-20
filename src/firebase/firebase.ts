import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

import { getAuth } from "firebase/auth";

export const VAPID_KEY =
  "BBWJ8FtlP6Ai1oXuMe3Hg7zyyqdBsH9CUAatuEQd18lecdTsXpCE5Sc0gBoqFI3SMEFI6cD3cf73zj1eBjZBFsE";

const firebaseConfig = {
  apiKey: "AIzaSyA3-pw6utfIFyi1yDC7qHIlyj33g-TAJDQ",
  authDomain: "pssd-app.firebaseapp.com",
  databaseURL: "https://pssd-app-default-rtdb.firebaseio.com",
  projectId: "pssd-app",
  storageBucket: "pssd-app.appspot.com",
  messagingSenderId: "141538485092",
  appId: "1:141538485092:web:76fb20bbbe96bc6c649071",
  measurementId: "G-T1N612GH4R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

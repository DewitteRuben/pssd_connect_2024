import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

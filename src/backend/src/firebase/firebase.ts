import { ServiceAccount } from "firebase-admin/app";
import admin from "firebase-admin";
import serviceAccountKey from "../serviceAccountKey.json" assert { type: "json" };

const FirebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as ServiceAccount),
  databaseURL: "https://pssd-app-default-rtdb.firebaseio.com",
});

export default FirebaseApp;

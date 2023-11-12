import { ServiceAccount } from "firebase-admin/app";
import admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import serviceAccountKey from "../serviceAccountKey.json" assert { type: "json" };

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as ServiceAccount),
  databaseURL: "https://pssd-app-default-rtdb.firebaseio.com",
});

class FirebaseUserAPI {
  private app: admin.app.App;
  constructor(app: admin.app.App) {
    this.app = app;
  }

  async getUserById(uid: string): Promise<UserRecord> {
    return this.app.auth().getUser(uid);
  }
}

const firebaseUserApi = new FirebaseUserAPI(app);

export { firebaseUserApi };

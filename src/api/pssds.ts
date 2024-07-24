import { User as FirebaseUser } from "firebase/auth";
import { LocationData } from "../backend/src/geolocation";
import { User, Relationship } from "../backend/src/database/user/types";

type MongoDBResult<T> = {
  success: boolean;
  message?: string;
  code: number;
  result: T;
};

class PSSDSocialApi {
  private baseURL: string;
  private firebaseUser: FirebaseUser | null = null;

  constructor() {
    this.baseURL = "http://localhost:3000";
  }

  setFirebaseUser(user: FirebaseUser | null) {
    this.firebaseUser = user;
  }

  private getEndpointURL(endpoint: string) {
    return `${this.baseURL}${endpoint}`;
  }

  private getToken() {
    if (this.firebaseUser === null) throw new Error("Firebase user is not set");

    return this.firebaseUser?.getIdToken();
  }

  private async post<T>(endpoint: string, payload: any) {
    const headers = new Headers();
    const jwtTokenId = await this.getToken();

    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${jwtTokenId}`);

    const result = await fetch(this.getEndpointURL(endpoint), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }).then((e) => e.json());

    return result as T;
  }

  private async put<T>(endpoint: string, payload: any) {
    const headers = new Headers();
    const jwtTokenId = await this.getToken();

    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${jwtTokenId}`);

    const result = await fetch(this.getEndpointURL(endpoint), {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    }).then((e) => e.json());

    return result as T;
  }

  private async get<T>(endpoint: string) {
    const headers = new Headers();
    const jwtTokenId = await this.getToken();

    headers.append("Authorization", `Bearer ${jwtTokenId}`);

    const result = await fetch(this.getEndpointURL(endpoint), {
      method: "GET",
      headers,
    }).then((e) => e.json());

    return result as T;
  }

  private async delete<T>(endpoint: string) {
    const headers = new Headers();
    const jwtTokenId = await this.getToken();

    headers.append("Authorization", `Bearer ${jwtTokenId}`);

    const result = await fetch(this.getEndpointURL(endpoint), {
      method: "DELETE",
      headers,
    }).then((e) => e.json());

    return result as T;
  }

  createUser(user: User) {
    return this.post<{ success: boolean; user?: User }>("/user", user);
  }

  getUser(uid: string): Promise<MongoDBResult<User>> {
    return this.get("/user/" + uid);
  }

  updateUser(user: User) {
    return this.put("/user", user);
  }

  deleteUser(uid: string) {
    return this.delete("/user/" + uid);
  }

  getSuggestions(uid: string): Promise<MongoDBResult<Relationship>> {
    return this.get("/relationship/" + uid);
  }

  likeUser(uid: string, likedUid: string): Promise<MongoDBResult<{}>> {
    return this.post("/relationship/like/" + likedUid, { uid });
  }

  dislikeUser(uid: string, dislikedUid: string): Promise<MongoDBResult<{}>> {
    return this.post("/relationship/dislike/" + dislikedUid, { uid });
  }

  unmatchUser(uid: string, unmatchedUid: string): Promise<MongoDBResult<{}>> {
    return this.post("/relationship/unmatch/" + unmatchedUid, { uid });
  }

  runSuggestion(uid: string) {
    return this.post("/relationship/suggestion/", { uid });
  }

  async locationReverseLookup(
    lattitude: number,
    longitude: number
  ): Promise<LocationData> {
    return this.post("/location/lookup", { lattitude, longitude });
  }
}

const pssdsAPI = new PSSDSocialApi();

export default pssdsAPI;

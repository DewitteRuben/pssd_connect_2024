import { User as FirebaseUser } from "firebase/auth";
import { User, Relationship } from "../backend/src/database/user/types";
import io, { Socket } from "socket.io-client";

type MongoDBResult<T> = {
  success: boolean;
  message?: string;
  shortcode?: string;
  code: number;
  result: T;
};

class PSSDSocialApi {
  private apiURL: string;
  private socketURL: string;
  private firebaseUser: FirebaseUser | null = null;
  private socket?: Socket;

  constructor() {
    this.apiURL = import.meta.env.VITE_API_URL;
    this.socketURL = import.meta.env.VITE_SOCKET_URL;
  }

  async setupRelationshipSocket({
    onSuggestion,
    onMatch,
  }: {
    onSuggestion?: (data: any) => void;
    onMatch?: (data: any) => void;
  }) {
    if (this.eventsInitialized) {
      this.socket?.emit("suggestion");
      return;
    }

    const jwtTokenId = await this.getToken();

    this.socket = io(this.socketURL, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${jwtTokenId}`,
          },
        },
      },
    });

    this.socket.on("connect", () => {
      console.log("connected");
      this.socket?.emit("suggestion");
    });

    this.socket.on("disconnect", () => {
      console.log("disconnected");
    });

    this.socket.on("connect_error", (err) => console.error(err));
    this.socket.on("connect_failed", (err) => console.error(err));

    this.socket.on("suggestion", (data) => {
      if (onSuggestion) {
        onSuggestion(JSON.parse(data));
      }
    });

    this.socket.on("match", (data) => {
      if (onMatch) {
        onMatch(data);
      }
    });
  }

  get eventsInitialized() {
    return this.socket !== undefined;
  }

  setFirebaseUser(user: FirebaseUser | null) {
    this.firebaseUser = user;
  }

  private getEndpointURL(endpoint: string) {
    return `${this.apiURL}${endpoint}`;
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

  cancelRegistration(uid: string) {
    return this.delete<{ success: boolean }>("/registration/cancel/" + uid);
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

  likeUser(uid: string, likedUid: string): Promise<MongoDBResult<unknown>> {
    return this.post("/relationship/like/" + likedUid, { uid });
  }

  dislikeUser(uid: string, dislikedUid: string): Promise<MongoDBResult<unknown>> {
    return this.post("/relationship/dislike/" + dislikedUid, { uid });
  }

  unmatchUser(uid: string, unmatchedUid: string): Promise<MongoDBResult<unknown>> {
    return this.post("/relationship/unmatch/" + unmatchedUid, { uid });
  }

  runSuggestion(uid: string) {
    return this.post("/relationship/suggestion/", { uid });
  }
}

const pssdsAPI = new PSSDSocialApi();

export default pssdsAPI;

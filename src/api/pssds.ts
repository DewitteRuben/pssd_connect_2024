import { User } from "../backend/src/database/user/user";
import { LocationData } from "../backend/src/geolocation";

type MongoDBResult<T> = {
  success: boolean;
  code: number;
  result: T;
};

class PSSDSocialApi {
  private baseURL: string;
  constructor() {
    this.baseURL = "http://localhost:3000";
  }

  private getEndpointURL(endpoint: string) {
    return `${this.baseURL}${endpoint}`;
  }

  private async post<T>(endpoint: string, payload: any) {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");

    const result = await fetch(this.getEndpointURL(endpoint), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }).then((e) => e.json());

    return result as T;
  }

  private async get<T>(endpoint: string) {
    const result = await fetch(this.getEndpointURL(endpoint)).then((e) => e.json());
    return result as T;
  }

  createUser(user: User) {
    return this.post<{ success: boolean; user?: User }>("/user", user);
  }

  getUser(uid: string): Promise<MongoDBResult<User>> {
    return this.get("/user/" + uid);
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

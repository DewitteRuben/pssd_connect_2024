import { LocationData } from "../backend/geolocation";

class PSSDSocialApi {
  private baseURL: string;
  constructor() {
    this.baseURL = "http://localhost:3000";
  }

  private getEndpointURL(endpoint: string) {
    return `${this.baseURL}${endpoint}`;
  }

  async locationReverseLookup(
    lattitude: number,
    longitude: number
  ): Promise<LocationData> {
    const endpoint = this.getEndpointURL("/location/lookup");

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const result = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ lattitude, longitude }),
    }).then((e) => e.json());

    return result;
  }
}

const pssdsAPI = new PSSDSocialApi();

export default pssdsAPI;

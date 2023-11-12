export interface LocationData {
  latitude: number;
  longitude: number;
  type: string;
  distance: number;
  name: string;
  number: string;
  postal_code: string;
  street: string;
  confidence: number;
  region: string;
  region_code: string;
  county: string;
  locality: string;
  administrative_area: string;
  neighbourhood: any;
  country: string;
  country_code: string;
  continent: string;
  label: string;
}
const POSITIONSTACK_ACCESS_KEY = "70996ee49f8062bcec9e9956e4810b3d";

type PositionStackEndpoint = "/reverse";

class PositionStack {
  baseURL = "http://api.positionstack.com/v1";

  private getEndpointURL(endpoint: PositionStackEndpoint) {
    return `${this.baseURL + endpoint}?access_key=${POSITIONSTACK_ACCESS_KEY}`;
  }

  async reverseLookup(lattitude: number, longitude: number): Promise<LocationData> {
    let url = this.getEndpointURL("/reverse");
    url = url + `&query=${lattitude},${longitude}`;

    const result = (await fetch(url).then((e) => e.json())) as { data: LocationData[] };
    return result.data[0];
  }
}

const PositionStackAPI = new PositionStack();

export { PositionStackAPI };

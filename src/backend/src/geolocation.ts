import { getEnvironmentVariables } from "./utils";

export interface LocationData {
  type: string;
  features: Feature[];
  query: Query;
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
  bbox: number[];
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  datasource: Datasource;
  name: string;
  country: string;
  country_code: string;
  state: string;
  city: string;
  postcode: string;
  district: string;
  suburb: string;
  street: string;
  housenumber: string;
  lon: number;
  lat: number;
  state_code: string;
  distance: number;
  result_type: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  category: string;
  timezone: Timezone;
  plus_code: string;
  rank: Rank;
  place_id: string;
}

export interface Datasource {
  sourcename: string;
  attribution: string;
  license: string;
  url: string;
}

export interface Rank {
  importance: number;
  popularity: number;
}

export interface Timezone {
  name: string;
  offset_STD: string;
  offset_STD_seconds: number;
  offset_DST: string;
  offset_DST_seconds: number;
  abbreviation_STD: string;
  abbreviation_DST: string;
}

export interface Query {
  lat: number;
  lon: number;
  plus_code: string;
}

const { GEOAPIFY_API_KEY } = getEnvironmentVariables("GEOAPIFY_API_KEY");

type PositionStackEndpoint = "/reverse";

// https://api.geoapify.com/v1/geocode/reverse?lat=51.21709661403662&lon=6.7782883744862374&apiKey=3e43595d312349f7a276186b08d4dda5
class GeolocationAPI {
  baseURL = "https://api.geoapify.com/v1/geocode";

  private getEndpointURL(endpoint: PositionStackEndpoint) {
    return `${this.baseURL + endpoint}?apiKey=${GEOAPIFY_API_KEY}`;
  }

  async reverseLookup(lattitude: number, longitude: number): Promise<LocationData> {
    let url = this.getEndpointURL("/reverse");
    url = url + `&lat=${lattitude}&lon=${longitude}`;

    return (await fetch(url).then((e) => e.json())) as LocationData;
  }
}

const geolocationApi = new GeolocationAPI();

export default geolocationApi;

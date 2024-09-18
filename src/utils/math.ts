import React from "react";
import { useStore } from "../store/store";
import { DistanceUnit } from "../backend/src/database/user/types";

export const kmToMiles = (km: number) => {
  return km * 0.621371;
};

export const computeDistanceString = (distanceInKm: number, unit?: DistanceUnit) => {
  if (unit === "mi") {
    return `${kmToMiles(distanceInKm).toFixed(0)} mi`;
  }

  return `${distanceInKm.toFixed(0)} km`;
};

export const useUnitDistance = (distanceInKm: number) => {
  const {
    user: { user: userData },
  } = useStore();

  const [distanceWithUnit, setDistanceString] = React.useState<string>(
    computeDistanceString(distanceInKm, userData?.distanceUnit)
  );

  React.useEffect(() => {
    if (userData?.distanceUnit) {
      setDistanceString(computeDistanceString(distanceInKm, userData.distanceUnit));
    }
  }, [userData?.distanceUnit, distanceInKm]);

  return distanceWithUnit;
};

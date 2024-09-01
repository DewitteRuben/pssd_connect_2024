import React from "react";
import { useStore } from "../store/store";

export const kmToMiles = (km: number) => {
  return (km * 0.621371);
};

export const useUnitDistance = (distanceInKm: number) => {
  const [distanceWithUnit, setDistanceString] = React.useState<string>();
  const {
    user: { user: userData },
  } = useStore();

  React.useEffect(() => {
    switch (userData?.distanceUnit) {
      case "km": {
        setDistanceString(`${distanceInKm.toFixed(1)} km`);
        break;
      }
      case "mi": {
        setDistanceString(`${kmToMiles(distanceInKm).toFixed(1)} mi`);
        break;
      }
    }
  }, [userData?.distanceUnit, distanceInKm]);

  return distanceWithUnit;
};

import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react";
import React from "react";

function getPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("geolocation not supported on this browser"));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Needs to be stored in a regular object to make it serializable
        resolve({
          coords: {
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            altitudeAccuracy: pos.coords.altitudeAccuracy,
            heading: pos.coords.heading,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            speed: pos.coords.speed,
          },
          timestamp: pos.timestamp,
        });
      },
      reject,
      options
    );
  });
}

type LocationButtonProps = {
  onChange?: (position: GeolocationPosition) => void;
};

const LocationButton: React.FC<LocationButtonProps> = ({ onChange }) => {
  const [grabbingLocation, setGrabbingLocation] = React.useState(false);
  const [position, setPosition] = React.useState<GeolocationPosition>();

  const onAllowLocationSubmit = async () => {
    try {
      setGrabbingLocation(true);
      const pos = await getPosition({ enableHighAccuracy: true });

      if (onChange) {
        onChange(pos);
      }

      setPosition(pos);
    } catch (error) {
      // TODO: add toast
      console.error(error);
    } finally {
      setGrabbingLocation(false);
    }
  };

  return (
    <Button
      onClick={onAllowLocationSubmit}
      colorScheme="green"
      isDisabled={!!position}
      isLoading={grabbingLocation}
      size="lg"
      type="submit"
    >
      Access location
    </Button>
  );
};

export default observer(LocationButton);

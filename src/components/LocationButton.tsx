import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react";
import pssdsAPI from "../api/pssds";
import React from "react";

function getPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("geolocation not supported on this browser"));
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
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

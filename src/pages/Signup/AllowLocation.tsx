import { Button, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import React from "react";
import LocationButton from "../../components/LocationButton";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { UserLocation } from "../../backend/src/database/user/user";

const AllowLocation = () => {
  const navigate = useNavigate();

  const { registration } = useStore();

  const [pos, setPos] = React.useState<GeolocationPosition>();

  const handleOnLocation = (pos: GeolocationPosition) => {
    setPos(pos);
    registration.updateRegistrationData({
      location: {
        coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        timestamp: pos.timestamp,
      } as UserLocation,
    });
  };

  const onContinue = async () => {
    try {
      await registration.finish();
      navigate("/");
    } catch (error) {
      console.error("Failed to finish registration");
    }
  };

  return (
    <RegistrationViewContainer title="Enable location">
      {!pos && (
        <>
          <Text align="center">
            We use your location to show you potential matches in your area.
          </Text>
          <LocationButton onChange={handleOnLocation} />
        </>
      )}

      {/* // TODO: display actual location here */}

      {pos && (
        <>
          <Text align="center">We've successfully read your location</Text>
          <Button onClick={onContinue} colorScheme="green" size="lg">
            FINISH REGISTRATION
          </Button>
        </>
      )}
    </RegistrationViewContainer>
  );
};

export default observer(AllowLocation);

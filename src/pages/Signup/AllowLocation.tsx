import { Button, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import React from "react";
import LocationButton from "../../components/LocationButton";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const AllowLocation = () => {
  const navigate = useNavigate();

  const { registration } = useStore();

  const [pos, setPos] = React.useState<GeolocationPosition>();

  const handleOnLocation = (pos: GeolocationPosition) => {
    setPos(pos);
    registration.updateRegistrationData({
      location: {
        type: "Point",
        coordinates: [pos.coords.longitude, pos.coords.latitude],
      },
    });
  };

  const onContinue = async () => {
    const next = registration.nextStep();
    navigate(next.step);
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
            CONTINUE
          </Button>
        </>
      )}
    </RegistrationViewContainer>
  );
};

export default observer(AllowLocation);

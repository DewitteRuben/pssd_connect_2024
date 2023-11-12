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
    registration.setData("location", pos);
  };

  const onContinue = async () => {
    const { success } = await registration.finishRegistration();
    if (!success) {
      throw new Error("failed to create account!!!");
    }

    navigate("/");
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

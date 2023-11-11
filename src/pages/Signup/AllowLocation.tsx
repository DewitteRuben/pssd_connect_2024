import { Button, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import LocationButton from "../../components/LocationButton";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";

const AllowLocation = () => {
  const navigate = useNavigate();

  const registration = React.useContext(RegistrationStoreContext);
  const [pos, setPos] = React.useState<GeolocationPosition>();

  const handleOnLocation = (pos: GeolocationPosition) => {
    setPos(pos);
    registration.setData("location", pos);
  };

  const onContinue = () => {
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
          <Button onSubmit={onContinue} colorScheme="green" size="lg" type="submit">
            CONTINUE
          </Button>
        </>
      )}
    </RegistrationViewContainer>
  );
};

export default observer(AllowLocation);

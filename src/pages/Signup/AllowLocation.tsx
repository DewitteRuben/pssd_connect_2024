import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import LocationButton from "../../components/LocationButton";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const AllowLocation = () => {
  const registration = React.useContext(RegistrationStoreContext);
  const [pos, setPos] = React.useState<GeolocationPosition>();

  const handleOnLocation = (pos: GeolocationPosition) => {
    setPos(pos);
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
          <Button colorScheme="green" size="lg" type="submit">
            CONTINUE
          </Button>
        </>
      )}
    </RegistrationViewContainer>
  );
};

export default observer(AllowLocation);

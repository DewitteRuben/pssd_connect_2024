import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import LocationButton from "../../components/LocationButton";

const AllowLocation = () => {
  const registration = React.useContext(RegistrationStoreContext);
  const [pos, setPos] = React.useState<GeolocationPosition>();

  const handleOnLocation = (pos: GeolocationPosition) => {
    setPos(pos);
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="x-large" fontWeight="bold">
          Enable location
        </Text>
        {!pos && (
          <>
            <Text align="center">
              You'll need to enable your location in order to use this app
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
      </VStack>
    </Box>
  );
};

export default observer(AllowLocation);

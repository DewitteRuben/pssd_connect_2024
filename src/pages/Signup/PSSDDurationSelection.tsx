import { Box, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikPrefGenderForm, {
  PSSDDurationSelectionPayload,
} from "../../components/PSSDDurationSelectionForm";

const PSSDDurationSelection = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onGenderSubmit = async (payload: PSSDDurationSelectionPayload) => {
    registration.setData("pssd_duration", payload.duration);
    registration.nextStep();
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="xx-large" fontWeight="bold">
          I've had PSSD for
        </Text>
        <FormikPrefGenderForm onSubmit={onGenderSubmit} />
      </VStack>
    </Box>
  );
};

export default observer(PSSDDurationSelection);

import { Box, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikGenderSelectionForm, {
  GenderSelectionPayload,
} from "../../components/GenderSelectionForm";

const GenderSelection = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onGenderSubmit = async (payload: GenderSelectionPayload) => {
    registration.setData("gender", payload.gender);
    registration.nextStep();
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="x-large" fontWeight="bold">
          I am a
        </Text>
        <FormikGenderSelectionForm onSubmit={onGenderSubmit} />
      </VStack>
    </Box>
  );
};

export default observer(GenderSelection);

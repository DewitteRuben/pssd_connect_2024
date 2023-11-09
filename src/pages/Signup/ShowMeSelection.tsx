import { Box, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikPrefGenderForm, { PrefGenderPayload } from "../../components/ShowMeSelectionForm";

const ShowMeSelection = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onGenderSubmit = async (payload: PrefGenderPayload) => {
    registration.setData("prefGender", payload.prefGender);
    registration.nextStep();
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="x-large" fontWeight="bold">
          Show me
        </Text>
        <FormikPrefGenderForm onSubmit={onGenderSubmit} />
      </VStack>
    </Box>
  );
};

export default observer(ShowMeSelection);

import { Box, Text, VStack } from "@chakra-ui/react";
import FormikBirthdateForm from "../../components/BirthdateForm";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import { BirthdatePayload } from "../../components/BirthdateForm";

const Birthdate = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onBirthdateSubmit = async (payload: BirthdatePayload) => {
    registration.setData("birthdate", payload.birthdate);
    registration.nextStep();
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="x-large" fontWeight="bold">
          My birthday is
        </Text>
        <FormikBirthdateForm onSubmit={onBirthdateSubmit} />
      </VStack>
    </Box>
  );
};

export default observer(Birthdate);

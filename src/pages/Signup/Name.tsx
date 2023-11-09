import { Box, Text, VStack } from "@chakra-ui/react";
import FormikNameForm, { NamePayload } from "../../components/NameForm";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";

const Name = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onNameSubmit = async (payload: NamePayload) => {
    registration.setData("firstName", payload.name);
    registration.nextStep();
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="x-large" fontWeight="bold">
          My first name is
        </Text>
        <FormikNameForm onSubmit={onNameSubmit} />
      </VStack>
    </Box>
  );
};

export default observer(Name);

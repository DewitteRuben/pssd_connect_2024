import { Box, Text, VStack, useToast } from "@chakra-ui/react";
import FormikEmailRegistrationForm, {
  EmailRegistrationPayload,
} from "../../components/EmailRegistrationForm";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import { AuthStoreContext } from "../../store/auth";
import { AuthError } from "firebase/auth";

const EmailRegistration = () => {
  const auth = React.useContext(AuthStoreContext);
  const registration = React.useContext(RegistrationStoreContext);
  const toast = useToast();

  const onEmailRegSubmit = async ({ email, password }: EmailRegistrationPayload) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      registration.nextStep();

    } catch (e) {
      const err = e as AuthError;
      toast({
        title: "Failed to send verification code",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="xx-large" fontWeight="bold">
          Create your account
        </Text>
        <FormikEmailRegistrationForm onSubmit={onEmailRegSubmit} />
      </VStack>
    </Box>
  );
};

export default observer(EmailRegistration);

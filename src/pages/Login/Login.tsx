import { Box, Text, useToast, VStack } from "@chakra-ui/react";
import FormikLoginForm, { LoginFormPayload } from "../../components/LoginForm";
import { observer } from "mobx-react";
import { useStore } from "../../store/store";
import Header from "../../components/Header";

const Login = observer(() => {
  const { auth } = useStore();
  const toast = useToast();

  const onLoginFormSubmit = async ({
    email,
    password,
    setSubmitting,
  }: LoginFormPayload) => {
    try {
      setSubmitting(true);

      const { success, message } = await auth.signIn(email, password);
      if (!success) {
        toast({
          title: "Login",
          description: message,
          status: "error",
          isClosable: true,
          
        });

        return;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header title="" path="/splash" hr={false} />
      <Box height="100%" paddingX={8}>
        <VStack height="100%" spacing={8}>
          <Text fontSize="x-large" fontWeight="bold">
            Log in to PSSD Connect
          </Text>
          <FormikLoginForm onSubmit={onLoginFormSubmit} />
        </VStack>
      </Box>
    </>
  );
});

export default Login;

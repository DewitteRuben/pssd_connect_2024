import { Box, Text, useToast, VStack } from "@chakra-ui/react";
import FormikLoginForm, { LoginFormPayload } from "../../components/LoginForm";
import { observer } from "mobx-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import Header from "../../components/Header";

const Login = observer(() => {
  const { registration, auth, user } = useStore();
  const toast = useToast();

  const navigate = useNavigate();

  if (auth.loggedIn && registration.isFinished) {
    return <Navigate replace to="/" />;
  }

  const onLoginFormSubmit = async ({
    email,
    password,
    setSubmitting,
  }: LoginFormPayload) => {
    try {
      const { success, message } = await auth.signIn(email, password);
      if (!success) {
        toast({
          title: "Login",
          description: message,
          status: "error",
          isClosable: true,
          position: "top",
        });

        return;
      }

      await user.fetchUserMetadata();

      navigate("/");
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

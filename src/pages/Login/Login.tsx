import { Box, Text, VStack } from "@chakra-ui/react";
import FormikLoginForm, { LoginFormPayload } from "../../components/LoginForm";
import { observer } from "mobx-react";
import { AuthStoreContext } from "../../store/auth";
import React from "react";
import { useNavigate } from "react-router-dom";

const Login = observer(() => {
  const auth = React.useContext(AuthStoreContext);
  const navigate = useNavigate();

  const onLoginFormSubmit = async ({
    email,
    password,
    setSubmitting,
  }: LoginFormPayload) => {
    try {
      await auth.signIn(email, password);

      navigate("/");
    } catch (error) {
      console.error("Failed to login", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="xx-large" fontWeight="bold">
          Log into your PSSD Dating account
        </Text>
        <FormikLoginForm onSubmit={onLoginFormSubmit}></FormikLoginForm>
      </VStack>
    </Box>
  );
});

export default Login;

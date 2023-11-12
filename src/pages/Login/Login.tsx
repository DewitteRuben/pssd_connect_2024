import { Box, Text, VStack } from "@chakra-ui/react";
import FormikLoginForm, { LoginFormPayload } from "../../components/LoginForm";
import { observer } from "mobx-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const Login = observer(() => {
  const { registration, auth } = useStore();
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
        <Text fontSize="x-large" fontWeight="bold">
          Log into PSSD Social
        </Text>
        <FormikLoginForm onSubmit={onLoginFormSubmit}></FormikLoginForm>
      </VStack>
    </Box>
  );
});

export default Login;

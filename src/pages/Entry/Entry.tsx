import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import React from "react";

const Entry = () => {
  const navigate = useNavigate();

  const {
    auth,
    user: { user: userData },
  } = useStore();

  React.useEffect(() => {
    if (auth.loggedIn && userData) {
      return navigate("/");
    }
  }, []);

  return (
    <Box backgroundColor="#14dbc3" height="100%">
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text
          fontSize="4xl"
          verticalAlign="center"
          color="white"
          fontWeight="bold"
          textAlign="center"
        >
          PSSD Dating
        </Text>
        <Button
          rounded="full"
          onClick={() => navigate("/login")}
          colorScheme="green"
          size="lg"
          variant="solid"
        >
          Login
        </Button>
        <Button
          rounded="full"
          onClick={() => navigate("/signup")}
          colorScheme="green"
          size="lg"
          variant="solid"
        >
          Sign up
        </Button>
      </VStack>
    </Box>
  );
};

export default Entry;

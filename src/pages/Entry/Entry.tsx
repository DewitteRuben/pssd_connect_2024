import { Box, Button, Image, Text, VStack } from "@chakra-ui/react";
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
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Box display="flex" alignItems="center" marginBottom={16}>
          <Image width="96px" src="/pssdconnect_logo.svg" marginRight={4} />
          <Text fontSize="3xl" fontWeight="bold" textAlign="left">
            PSSD
            <br />
            Connect
          </Text>
        </Box>
        <Button
          width="100%"
          rounded="full"
          onClick={() => navigate("/login")}
          size="lg"
          variant="solid"
        >
          Login
        </Button>
        <Button
          rounded="full"
          width="100%"
          onClick={() => navigate("/signup")}
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

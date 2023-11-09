import { Box, Button, Text, VStack } from "@chakra-ui/react";

const Entry = () => {
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
        <Button rounded="full" colorScheme="green" size="lg" variant="solid">
          Login
        </Button>
        <Button rounded="full" colorScheme="green" size="lg" variant="solid">
          Sign up
        </Button>
      </VStack>
    </Box>
  );
};

export default Entry;

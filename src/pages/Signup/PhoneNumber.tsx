import { Box, Text, VStack } from "@chakra-ui/react";
import FormikPhoneNumberForm from "../../components/PhoneNumberForm";
import { observer } from "mobx-react";

const PhoneNumber = observer(() => {
  const onPhoneNumberSubmit = async (payload: any) => {
    console.log(payload);
  };

  return (
    <Box height="100%" paddingX={8}>
      <VStack height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="x-large" fontWeight="bold">
          My number is
        </Text>
        <FormikPhoneNumberForm onSubmit={onPhoneNumberSubmit} />
      </VStack>
    </Box>
  );
});

export default PhoneNumber;

import { Box, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";

type RegistrationModeContainerProps = {
  title: string;
};

const RegistrationModeContainer: React.FC<
  React.PropsWithChildren<RegistrationModeContainerProps>
> = ({ title, children }) => {
  return (
    <Box height="100%" padding={12}>
      <VStack width="100%" height="100%" spacing={8}>
        <Text fontSize="xx-large" fontWeight="bold">
          {title}
        </Text>
        {children}
      </VStack>
    </Box>
  );
};

export default observer(RegistrationModeContainer);

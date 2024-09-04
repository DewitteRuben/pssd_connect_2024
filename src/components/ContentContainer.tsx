import { Box } from "@chakra-ui/react";

const ContentContainer = (props: React.ComponentProps<typeof Box>) => {
  return <Box {...props} paddingX="16px" paddingTop="4px" />;
};

export default ContentContainer;

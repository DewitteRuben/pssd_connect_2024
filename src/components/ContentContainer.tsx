import { Box } from "@chakra-ui/react";

const ContentContainer = (props: React.ComponentProps<typeof Box>) => {
  return <Box paddingX="16px" paddingTop="4px" {...props} />;
};

export default ContentContainer;

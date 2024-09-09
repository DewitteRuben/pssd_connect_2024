import { Box, IconButton, Heading } from "@chakra-ui/react";
import React from "react";
import { FaShieldAlt } from "react-icons/fa";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { StickyHeader } from "./Header";

type TMessageHeader = {
  name: string;
  sticky?: boolean;
  hr?: boolean;
  margin?: boolean;
  onSafetyClick?: () => void;
  onBack?: () => void;
};

const MessageHeader: React.FC<TMessageHeader> = ({
  name,
  sticky = true,
  onSafetyClick,
  onBack,
  hr = true,
  margin = true,
}) => {
  return (
    <StickyHeader
      $margin={margin}
      $sticky={sticky}
      $hr={hr}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="12px"
    >
      <IconButton
        background="none"
        aria-label="back"
        cursor="pointer"
        boxSize="36px"
        onClick={onBack}
        as={ArrowBackIcon}
      />
      <Heading textAlign="center" size="md">
        Now talking to {name}
      </Heading>
      <Box>
        <IconButton
          onClick={onSafetyClick}
          aria-label="Safety"
          variant="outline"
          icon={<FaShieldAlt />}
        />
      </Box>
    </StickyHeader>
  );
};

export default MessageHeader;

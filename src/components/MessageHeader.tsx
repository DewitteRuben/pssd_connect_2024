import { Box, IconButton, Heading } from "@chakra-ui/react";
import React from "react";
import "./Header.css";
import { FaShieldAlt } from "react-icons/fa";
import { ArrowBackIcon } from "@chakra-ui/icons";

type TMessageHeader = {
  name: string;
  sticky?: boolean;
  onSafetyClick?: () => void;
  onBack?: () => void;
};

const MessageHeader: React.FC<TMessageHeader> = ({
  name,
  sticky,
  onSafetyClick,
  onBack,
}) => {
  sticky = sticky === undefined ? true : sticky;

  return (
    <Box
      className={sticky ? "Header-sticky" : ""}
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
    </Box>
  );
};

export default MessageHeader;

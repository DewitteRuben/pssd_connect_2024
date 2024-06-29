import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, Heading, Box } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

type THeader = {
  path: string;
  title: string;
  sticky?: boolean;
};

const Header: React.FC<THeader> = ({ path, title, sticky }) => {
  sticky = sticky === undefined ? true : sticky

  const navigate = useNavigate();

  return (
    <Box
      className={sticky ? "Header-sticky" : ""}
      display="flex"
      alignItems="center"
      padding="12px"
    >
      <IconButton
        background="none"
        aria-label="back"
        cursor="pointer"
        boxSize="36px"
        onClick={() => navigate(path)}
        as={ArrowBackIcon}
      />
      <Heading marginLeft="24px" size="md">
        {title}
      </Heading>
    </Box>
  );
};

export default Header;

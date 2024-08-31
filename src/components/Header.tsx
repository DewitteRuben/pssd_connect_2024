import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, Heading, Box } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type THeader = {
  title?: string;
  path?: string;
  hr?: boolean;
  sticky?: boolean;
};

export const StickyHeader = styled(Box)<{ $sticky: boolean; $hr: boolean; }>`
  position: ${(props) => (props.$sticky ? "fixed" : "static")};
  top: 0;
  width: 100%;
  z-index: 100;
  background: var(--chakra-colors-chakra-body-bg);
  border-bottom: ${(props) =>
    props.$hr ? "1px solid var(--chakra-colors-chakra-border-color)" : "0px"};

  & + div {
    padding-top: 60px;
  }
`;

const Header: React.FC<THeader> = ({ path, title, sticky, hr }) => {
  sticky = sticky === undefined ? true : sticky;
  hr = hr === undefined ? true : hr;

  const navigate = useNavigate();

  return (
    <StickyHeader
      $hr={hr}
      $sticky={sticky}
      display="flex"
      minHeight="61px"
      alignItems="center"
      padding="12px"
    >
      {path && (
        <IconButton
          background="none"
          aria-label="back"
          cursor="pointer"
          boxSize="36px"
          onClick={() => navigate(path)}
          as={ArrowBackIcon}
        />
      )}
      <Heading marginLeft="24px" size="md">
        {title}
      </Heading>
    </StickyHeader>
  );
};

export default Header;

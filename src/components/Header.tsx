import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, Heading, Box } from "@chakra-ui/react";
import React from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type THeader = {
  onCancel?: () => void;
  title?: string;
  path?: string;
  hr?: boolean;
  close?: boolean;
  goBack?: boolean;
  sticky?: boolean;
  margin?: boolean;
};

export const StickyHeader = styled(Box)<{
  $sticky: boolean;
  $hr: boolean;
  $margin: boolean;
}>`
  position: ${(props) => (props.$sticky ? "fixed" : "static")};
  top: 0;
  width: 100%;
  z-index: 100;
  background: var(--chakra-colors-chakra-body-bg);
  border-bottom: ${(props) =>
    props.$hr ? "1px solid var(--chakra-colors-chakra-border-color)" : "0px"};

  & + div {
    margin-top: ${(props) => (props.$margin ? "60px" : "0")};
  }
`;

const Header: React.FC<THeader> = ({
  path,
  title,
  sticky = true,
  hr = true,
  goBack,
  close,
  onCancel,
  margin = true,
}) => {

  const navigate = useNavigate();

  const onHandleClick = () => {
    if (goBack) {
      navigate(-1);
    } else if (path) {
      navigate(path);
    }
  };

  const handleOnClose = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <StickyHeader
      $hr={hr}
      $margin={margin}
      $sticky={sticky}
      display="flex"
      minHeight="61px"
      position="relative"
      alignItems="center"
      padding="12px"
    >
      {path || goBack ? (
        <IconButton
          background="none"
          aria-label="back"
          cursor="pointer"
          onClick={onHandleClick}
          icon={<ArrowBackIcon fontSize={32} />}
        />
      ) : null}

      {close && (
        <IconButton
          background="none"
          aria-label="stop"
          onClick={handleOnClose}
          cursor="pointer"
          position="absolute"
          right="12px"
          icon={<IoMdClose fontSize={32} />}
        />
      )}
      <Heading marginLeft="24px" size="md">
        {title}
      </Heading>
    </StickyHeader>
  );
};

export default Header;

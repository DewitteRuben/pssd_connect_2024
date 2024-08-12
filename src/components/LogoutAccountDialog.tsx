import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  Modal,
  Text,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React from "react";

import { useStore } from "../store/store";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type TLogoutAccountDialog = {};

const LogoutAccountDialogButton = styled(Button)`
  width: 100%;
`;

const LogoutAccountDialog: React.FC<TLogoutAccountDialog> = () => {
  const { auth } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>();

  const toast = useToast();

  const onAccountLogoutClick = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Failed to logout account", error);
      toast({
        title: "Account",
        description: "Failed to logout your account",
        status: "error",
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  return (
    <>
      <LogoutAccountDialogButton
        onClick={onOpen}
        colorScheme="gray"
        size="md"
        type="submit"
      >
        Logout
      </LogoutAccountDialogButton>
      <AlertDialog
        size="xs"
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Logout
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to logout? You will continue to be seen by other
              users.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onAccountLogoutClick} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default LogoutAccountDialog;

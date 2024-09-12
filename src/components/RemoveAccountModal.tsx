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
} from "@chakra-ui/react";
import React from "react";

import { useStore } from "../store/store";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const RemoveAccountModalButton = styled(Button)`
  width: 100%;
`;

const RemoveAccountModal = () => {
  const { user: userStore } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const toast = useToast();

  const onDeleteAccountClick = async () => {
    try {
      await userStore.deleteUser();

      toast({
        title: "Account",
        description: "We've successfully deleted your account",
        status: "success",
        isClosable: true,
        
      });

      navigate(0);
    } catch (error) {
      console.error("Failed to update age range", error);
      toast({
        title: "Account",
        description: "Failed to delete your account",
        status: "error",
        isClosable: true,
        
      });
    } finally {
      onClose();
    }
  };

  return (
    <>
      <RemoveAccountModalButton
        onClick={onOpen}
        colorScheme="red"
        size="md"
        type="submit"
      >
        Remove account
      </RemoveAccountModalButton>
      <Modal size="xs" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Removing your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack>
              <Text>
                You are about to delete your account. Please keep in mind that this action
                is irreversible.
              </Text>
              <Text>Once your account has been deleted, there is no turning back.</Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={onDeleteAccountClick}
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              ml={3}
            >
              Delete account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RemoveAccountModal;

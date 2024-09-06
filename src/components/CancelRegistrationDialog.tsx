import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";

type TCancelRegistrationDialog = {
  isOpen: boolean;
  onClose: () => void;
};

const CancelRegistrationDialog: React.FC<TCancelRegistrationDialog> = ({
  isOpen,
  onClose,
}) => {
  const { registration } = useStore();
  const navigate = useNavigate();
  const cancelRef = React.useRef<any>();

  const onRegistrationCancelClick = async () => {
    try {
      await registration.cancel();
      onClose();

      navigate("/");
    } catch (error) {
      onClose();

      console.log("failed to cancel registration");
    }
  };

  return (
    <AlertDialog
      size="xs"
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Canceling the registration process
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack>
              <Text>Are you sure you want to cancel your registration?</Text>
              <Text> You will lose all the data you have entered so far.</Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" onClick={onRegistrationCancelClick} ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CancelRegistrationDialog;

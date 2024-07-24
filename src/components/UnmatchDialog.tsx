import React, { PropsWithChildren } from "react";

import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { IoMdCloseCircle } from "react-icons/io";

type TUnmatchDialogButton = {
  onConfirm?: () => void;
} & PropsWithChildren;

const UnmatchDialogButton: React.FC<TUnmatchDialogButton> = ({ children, onConfirm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    <>
      <Button
        leftIcon={<IoMdCloseCircle size="24px" color="orange" />}
        onClick={onOpen}
        variant="outline"
      >
        {children}
      </Button>

      <AlertDialog
        isCentered
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Unmatch
            </AlertDialogHeader>

            <AlertDialogBody>Would you like to unmatch this user?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (onConfirm) {
                    onConfirm();
                  }
                  
                  onClose();
                }}
                ml={3}
              >
                Yes, unmatch
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UnmatchDialogButton;

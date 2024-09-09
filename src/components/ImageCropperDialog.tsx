import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  Box,
} from "@chakra-ui/react";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import React, { useRef } from "react";

type TImageCropperDialog = {
  src?: string;
  onCrop?: ({ blob, dataURL }: { blob: Blob; dataURL: string }) => void;
  aspectRatio?: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const ImageCropperDialog: React.FC<TImageCropperDialog> = ({
  src,
  isOpen,
  onClose,
  onCrop,
  aspectRatio = 7 / 10,
}) => {
  const cropperJS = useRef<Cropper>();
  const [imageRef, setImageRef] = React.useState<HTMLImageElement | null>();
  const [processing, setProcessing] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (imageRef) {
      cropperJS.current = new Cropper(imageRef, {
        aspectRatio,
      });
    }

    return () => {
      cropperJS.current?.destroy();
    };
  }, [isOpen, imageRef, aspectRatio]);

  const onCropImageClick = () => {
    if (!cropperJS.current) throw new Error("cropperJS instance not found");

    setProcessing(true);
    const canvasElement = cropperJS.current.getCroppedCanvas({
      maxWidth: 640,
      maxHeight: 640,
      imageSmoothingQuality: "high",
    });

    canvasElement.toBlob((blob) => {
      if (onCrop && blob) {
        onCrop({ blob, dataURL: canvasElement.toDataURL() });
      }

      onClose();
      setProcessing(false);
    });
  };

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop your image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <img src={src} ref={(el) => setImageRef(el)} />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button isLoading={processing} onClick={onCropImageClick} colorScheme="green">
            Crop Image
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImageCropperDialog;

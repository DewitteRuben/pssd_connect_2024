import React, { useRef } from "react";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import { Box, Icon, Spinner, useDisclosure } from "@chakra-ui/react";
import ImageCropperDialog from "./ImageCropperDialog";

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  border: 1px solid #ccc;
  background-size: cover;
  background-position: center;
  width: 100px;
  height: 160px;
  border-radius: 16px;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: -5px;
  right: -5px;
  border: 1px solid var(--chakra-colors-green-500);
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
  background-color: var(--chakra-colors-green-500);
  fill: white;
  width: 20px;
  height: 20px;
`;

const ImageLoadingSpinner = styled(Spinner)`
  position: absolute;
  top: 40%;
  left: 40%;
`;

const readFile = (file: File): Promise<{ base64: string; file: File }> => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      res({ base64: reader.result as string, file });
    });
    reader.addEventListener("error", rej);
    reader.readAsDataURL(file);
  });
};

export type ImagePickerResult = {
  base64: string;
  file: File;
};

type ImagePickerItemProps = {
  onSelect?: (result: ImagePickerResult | null) => void;
  defaultImage?: string;
};

const ImagePickerItem: React.FC<ImagePickerItemProps> = ({ onSelect, defaultImage }) => {
  const fileResultRef = useRef<{
    base64: string;
    file: File;
  } | null>();

  const [isLoadingImage, setLoadingImage] = React.useState<boolean>(false);
  const [loadedImage, setLoadedImage] = React.useState<string>();
  const [actualImage, setActualImage] = React.useState<string>(defaultImage ?? "");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOnChange = async (e: any) => {
    const [file] = e.target.files;

    setLoadingImage(true);

    try {
      const result = await readFile(file);
      fileResultRef.current = result;

      setLoadedImage(fileResultRef.current.base64);
    } finally {
      setLoadingImage(false);

      onOpen();
    }
  };

  const onClearImageClick = () => {
    if (onSelect) {
      onSelect(null);
    }

    fileResultRef.current = null;

    setLoadedImage("");
    setActualImage("");
  };

  const handleOnCrop = ({ blob, dataURL }: { blob: Blob; dataURL: string }) => {
    if (!fileResultRef.current?.file) throw new Error("file not found");

    if (onSelect) {
      onSelect({
        base64: dataURL,
        file: new File([blob], fileResultRef.current?.file.name),
      });
    }

    setActualImage(dataURL);
  };

  return (
    <>
      <Box position="relative">
        <Label style={{ backgroundImage: `url(${actualImage})` }}>
          <Input accept="image/*" onChange={handleOnChange} type="file" />
        </Label>
        {actualImage && <CloseIcon onClick={onClearImageClick} as={MdClose} />}
        {isLoadingImage && <ImageLoadingSpinner />}
      </Box>
      <ImageCropperDialog
        onCrop={handleOnCrop}
        src={loadedImage}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </>
  );
};

export default ImagePickerItem;

import React from "react";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import { Box, Icon } from "@chakra-ui/react";

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

const readFile = (file: File): Promise<{ base64: string; file: File }> => {
  return new Promise((res, rej) => {
    var reader = new FileReader();
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
};

const ImagePickerItem: React.FC<ImagePickerItemProps> = ({ onSelect }) => {
  const [base64, setBase64] = React.useState<string>();

  const handleOnChange = async (e: any) => {
    const [file] = e.target.files;
    const result = await readFile(file);
    if (onSelect) {
      onSelect(result);
    }

    setBase64(result.base64);
  };

  const onClearImageClick = () => {
    if (onSelect) {
      onSelect(null);
    }

    setBase64("");
  };

  return (
    <Box position="relative">
      <Label style={{ backgroundImage: `url(${base64})` }}>
        <Input accept="image/*" onChange={handleOnChange} type="file" />
      </Label>
      {base64 && <CloseIcon onClick={onClearImageClick} as={MdClose} />}
    </Box>
  );
};

export default ImagePickerItem;

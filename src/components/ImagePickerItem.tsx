import React from "react";
import styled from "styled-components";

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

const readFile = (file: File): Promise<string> => {
  return new Promise((res, rej) => {
    var reader = new FileReader();
    reader.addEventListener("load", () => {
      res(reader.result as string);
    });
    reader.addEventListener("error", rej);
    reader.readAsDataURL(file);
  });
};

type ImagePickerItemProps = {
  onSelect?: (base64_data: string) => void;
};

const ImagePickerItem: React.FC<ImagePickerItemProps> = ({ onSelect }) => {
  const [base64, setBase64] = React.useState<string>();

  const handleOnChange = async (e: any) => {
    const [file] = e.target.files;
    const res = await readFile(file);
    if (onSelect) {
      onSelect(res);
      setBase64(res);
    }
  };

  return (
    <Label style={{ backgroundImage: `url(${base64})` }}>
      <Input accept="image/*" onChange={handleOnChange} type="file" />
    </Label>
  );
};

export default ImagePickerItem;

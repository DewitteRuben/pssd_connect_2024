import React from "react";
import ImagePickerItem, { ImagePickerResult } from "./ImagePickerItem";
import { Grid } from "@chakra-ui/react";

export type ImagePickerEntry = {
  id: number;
  base64?: string;
  dirty?: boolean;
  src?: string;
  file?: File;
  existing?: boolean;
};

type ImagePickerProps = {
  images: ImagePickerEntry[];
  onChange?: (images: ImagePickerEntry[]) => void;
};

const ImagePicker: React.FC<ImagePickerProps> = ({ onChange, images }) => {
  const handleOnImageSelect = (id: number) => (result: ImagePickerResult | null) => {
    const currentImgIndex = images.findIndex((img) => img.id === id);
    const updatedImageItem = {
      ...images[currentImgIndex],
      dirty: result ? true : images[currentImgIndex].src ? true : false,
      src: result ? images[currentImgIndex].src : undefined,
      base64: result ? result.base64 : undefined,
      file: result ? result.file : undefined,
    };

    const newImages = [
      ...images.slice(0, currentImgIndex),
      updatedImageItem,
      ...images.slice(currentImgIndex + 1),
    ];

    if (onChange) {
      onChange(newImages);
    }
  };

  return (
    <Grid
      width="100%"
      justifyItems="center"
      templateColumns="repeat(auto-fit, minmax(100px, 1fr))"
      columnGap={2}
      rowGap={6}
    >
      {images.map((img) => (
        <ImagePickerItem
          defaultImage={img.src}
          key={img.id}
          onSelect={handleOnImageSelect(img.id)}
        />
      ))}
    </Grid>
  );
};

export default ImagePicker;

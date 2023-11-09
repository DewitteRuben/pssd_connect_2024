import React from "react";
import ImagePickerItem from "./ImagePickerItem";
import { Grid } from "@chakra-ui/react";

export type ImagePickerEntry = {
  id: number;
  base64?: string;
};

type ImageManagerProps = {
  size?: number;
  onChange?: (images: ImagePickerEntry[]) => void;
};

const ImageManager: React.FC<ImageManagerProps> = ({ size, onChange }) => {
  const [images, setImages] = React.useState<ImagePickerEntry[]>(
    [...Array(size ?? 6).keys()].map((id) => ({ id }))
  );

  const handleOnImageSelect = (id: number) => (base64_data: string) => {
    const currentImgIndex = images.findIndex((img) => img.id === id);
    const updatedTodo = { ...images[currentImgIndex], base64: base64_data };
    const newImages = [
      ...images.slice(0, currentImgIndex),
      updatedTodo,
      ...images.slice(currentImgIndex + 1),
    ];

    if (onChange) {
      onChange(newImages)
    }

    setImages(newImages);
  };

  return (
    <Grid
      width="100%"
      justifyItems="center"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(auto-fit, minmax(100px, 1fr))"
      columnGap={2}
      rowGap={6}
    >
      {images.map((img) => (
        <ImagePickerItem key={img.id} onSelect={handleOnImageSelect(img.id)} />
      ))}
    </Grid>
  );
};

export default ImageManager;

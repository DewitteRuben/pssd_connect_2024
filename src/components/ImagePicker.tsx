import React from "react";
import ImagePickerItem, { ImagePickerResult } from "./ImagePickerItem";
import { Grid } from "@chakra-ui/react";

export type ImagePickerEntry = {
  id: number;
  base64?: string;
  defaultImage?: string;
  file?: File;
  existing?: boolean;
};

type ImagePickerProps = {
  defaultImages?: string[];
  size?: number;
  onChange?: (images: ImagePickerEntry[]) => void;
};

const ImagePicker: React.FC<ImagePickerProps> = ({ size, onChange, defaultImages }) => {
  const [images, setImages] = React.useState<ImagePickerEntry[]>(
    [...Array(size ?? 6).keys()].map((id, index) => ({
      id,
      ...(defaultImages?.[index]
        ? { defaultImage: defaultImages?.[index], existing: true }
        : {}),
    }))
  );

  const handleOnImageSelect = (id: number) => (result: ImagePickerResult | null) => {
    const currentImgIndex = images.findIndex((img) => img.id === id);
    const updatedImageItem = {
      ...images[currentImgIndex],
      defaultImage: result ? images[currentImgIndex].defaultImage : undefined,
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

    setImages(newImages);
  };

  React.useEffect(() => {
    if (onChange) {
      onChange(images);
    }
  }, [images, defaultImages]);

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
        <ImagePickerItem
          defaultImage={img.defaultImage}
          key={img.id}
          onSelect={handleOnImageSelect(img.id)}
        />
      ))}
    </Grid>
  );
};

export default ImagePicker;

import { Button, Progress, Text } from "@chakra-ui/react";
import ImagePicker, { ImagePickerEntry } from "./ImagePicker";
import styled from "styled-components";
import React from "react";
import { useStore } from "../store/store";
import { uploadImageFile } from "../firebase/storage";

const ProgressBar = styled(Progress)`
  width: 100%;
`;

const calcOverAllProgress = (progressMap: Record<string, number>) => {
  let sumOfProgress = 0;
  for (const name in progressMap) {
    const progress = progressMap[name];
    sumOfProgress += progress;
  }

  const amountOfEntries = Object.keys(progressMap).length;
  return (sumOfProgress / (amountOfEntries * 100)) * 100;
};

type ProfileImageManagerProps = {
  cells?: number;
  upload?: boolean;
  buttonText: string;
  defaultImages?: string[];
  onSubmit?: (images: string[] | ImagePickerEntry[]) => void;
};

const ProfileImageManager: React.FC<ProfileImageManagerProps> = ({
  upload = true,
  onSubmit,
  defaultImages,
  buttonText,
  cells,
}) => {
  const imageGrid = React.useMemo(
    () =>
      Array.from({ length: cells ?? 6 }, (_, id) => ({
        id,
        src: defaultImages?.[id],
      })),
    [defaultImages, cells]
  );

  const [images, setImages] = React.useState<ImagePickerEntry[]>(imageGrid);
  const hasDirtyImages = images.some((img) => img.dirty);

  const [uploadProgress, setUploadProgress] = React.useState({});
  const [isUploading, setIsUploading] = React.useState(false);
  const { auth } = useStore();

  const hasNoImage = images.filter((img) => img.base64 || img.src).length === 0;

  const handleOnContinueClick = async () => {
    if (!auth.user) throw new Error("no existing user was found, invalid state!");

    if (hasNoImage) {
      throw new Error("no images were selected");
    }

    if (!upload) {
      if (onSubmit) {
        onSubmit(images);
      }
      return;
    }

    const imageUploadTasks: Promise<string>[] = [];
    for (const image of images) {
      if (image.file) {
        const imageUploadTask = uploadImageFile(
          auth.user,
          image.file,
          (progress, name) => {
            setUploadProgress((up) => ({ ...up, [name]: progress }));
          }
        );

        imageUploadTasks.push(imageUploadTask);
      } else if (image.src) {
        const srcURL: Promise<string> = new Promise((res) => res(image.src!));

        imageUploadTasks.push(srcURL);
      }
    }

    try {
      setIsUploading(true);
      const imageURLs = await Promise.all(imageUploadTasks);

      if (onSubmit) {
        onSubmit(imageURLs);
      }

      setImages((images) => {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const imageURL = imageURLs[i];

          if (image.dirty) {
            image.dirty = false;
          }

          if (imageURL) {
            image.src = imageURL;
          }
        }

        return images;
      });
    } catch (error) {
      console.error("Failed to upload images", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ImagePicker images={images} onChange={setImages} />
      {isUploading && (
        <>
          <Text fontSize="sm">We are uploading your images...</Text>
          <ProgressBar value={calcOverAllProgress(uploadProgress)} />
        </>
      )}
      <Button
        marginTop={4}
        colorScheme="green"
        size="lg"
        onClick={handleOnContinueClick}
        isLoading={isUploading}
        isDisabled={hasNoImage || !hasDirtyImages}
      >
        {buttonText}
      </Button>
    </>
  );
};

export default ProfileImageManager;

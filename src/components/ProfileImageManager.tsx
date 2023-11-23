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
  cells,
  upload = true,
  onSubmit,
  defaultImages,
  buttonText,
}) => {
  const [images, setImages] = React.useState<ImagePickerEntry[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState({});
  const [isUploading, setIsUploading] = React.useState(false);
  const { auth } = useStore();

  const hasNoImage = images.filter((img) => img.base64 || img.defaultImage).length === 0;

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
      } else if (image.defaultImage) {
        const defaultImageURL: Promise<string> = new Promise((res) =>
          res(image.defaultImage!)
        );

        imageUploadTasks.push(defaultImageURL);
      }
    }

    try {
      setIsUploading(true);
      const imageURLs = await Promise.all(imageUploadTasks);

      if (onSubmit) {
        onSubmit(imageURLs);
      }
    } catch (error) {
      console.error("Failed to upload images", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ImagePicker defaultImages={defaultImages} size={cells ?? 4} onChange={setImages} />
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
        isDisabled={hasNoImage}
      >
        {buttonText}
      </Button>
    </>
  );
};

export default ProfileImageManager;

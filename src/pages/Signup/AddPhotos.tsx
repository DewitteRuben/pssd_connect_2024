import React from "react";
import { Button, Progress, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import ImageManager, { ImagePickerEntry } from "../../components/ImageManager";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { uploadImageFile } from "../../firebase/storage";
import styled from "styled-components";
import { useStore } from "../../store/store";

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

const AddPhotos = () => {
  const [images, setImages] = React.useState<ImagePickerEntry[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState({});
  const [isUploading, setIsUploading] = React.useState(false);

  const { auth, registration } = useStore();
  const navigate = useNavigate();
  const hasNoImage = images.filter((img) => img.base64).length === 0;

  const handleOnContinueClick = async () => {
    if (!auth.user) throw new Error("no existing user was found, invalid state!");
    if (hasNoImage) {
      throw new Error("no images were selected");
    }

    const imageUploadTasks = [];
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
      }
    }

    try {
      setIsUploading(true);
      const imageURLs = await Promise.all(imageUploadTasks);
      registration.setData("images", imageURLs);
      const next = registration.nextStep();
      navigate(next.step);
    } catch (error) {
      console.error("Failed to upload images", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <RegistrationViewContainer title="Add your first photo">
      <Text fontSize="sm">Choose at least one image to continue</Text>
      <ImageManager size={4} onChange={setImages} />
      {isUploading && (
        <>
          <Text fontSize="sm">We are uploading your images...</Text>
          <ProgressBar value={calcOverAllProgress(uploadProgress)} />
        </>
      )}
      <Button
        colorScheme="green"
        size="lg"
        onClick={handleOnContinueClick}
        isLoading={isUploading}
        isDisabled={hasNoImage}
      >
        CONTINUE
      </Button>
    </RegistrationViewContainer>
  );
};

export default observer(AddPhotos);

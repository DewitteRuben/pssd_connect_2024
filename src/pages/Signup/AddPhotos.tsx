import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import ImageManager, { ImagePickerEntry } from "../../components/ImageManager";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const AddPhotos = () => {
  const [images, setImages] = React.useState<ImagePickerEntry[]>([]);
  const registration = React.useContext(RegistrationStoreContext);

  const hasNoImage = images.filter((img) => img.base64).length === 0;

  const handleOnContinueClick = () => {
    if (!hasNoImage) {
      // upload images to cloud
      registration.nextStep();
    }
  };

  return (
    <RegistrationViewContainer title="Add photos">
      <Text fontSize="sm">Choose at least one image to continue</Text>
      <ImageManager onChange={setImages} />
      <Button
        colorScheme="green"
        size="lg"
        onClick={handleOnContinueClick}
        isDisabled={hasNoImage}
      >
        CONTINUE
      </Button>
    </RegistrationViewContainer>
  );
};

export default observer(AddPhotos);

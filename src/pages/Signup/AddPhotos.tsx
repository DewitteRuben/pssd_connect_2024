import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import ImageManager, { ImagePickerEntry } from "../../components/ImageManager";

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
    <Box height="100%" paddingX={8}>
      <VStack width="100%" height="100%" justifyContent="center" spacing={8}>
        <Text fontSize="x-large" fontWeight="bold">
          Add photos
        </Text>
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
      </VStack>
    </Box>
  );
};

export default observer(AddPhotos);

import { Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useStore } from "../../store/store";
import ProfileImageManager from "../../components/ProfileImageManager";
import { ImagePickerEntry } from "../../components/ImagePicker";

const AddPhotos = () => {
  const navigate = useNavigate();
  const { registration } = useStore();

  const handleUploadFinished = (images: string[] | ImagePickerEntry[]) => {
    registration.updateRegistrationData({ images: images as string[] });
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="Add your first photo">
      <Text fontSize="sm">Choose at least one image to continue</Text>
      <ProfileImageManager cells={2} buttonText="CONTINUE" onSubmit={handleUploadFinished} />
    </RegistrationViewContainer>
  );
};

export default observer(AddPhotos);

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Divider, Heading, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import ProfileImageManager from "../../components/ProfileImageManager";
import { ImagePickerEntry } from "../../components/ImagePicker";

const Info = () => {
  const { user: userStore } = useStore();
  const navigate = useNavigate();

  const userData = userStore.user;

  if (!userData) {
    throw new Error("Invalid state! User not found");
  }

  const handleOnImageUpdate = (images: string[] | ImagePickerEntry[]) => {
    console.log(images);
    userStore.updateUser({ images: images as string[] });
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" padding="12px">
        <IconButton
          background="none"
          aria-label="back"
          cursor="pointer"
          boxSize="36px"
          onClick={() => navigate("/profile")}
          as={ArrowBackIcon}
        />
        <Heading marginLeft="24px" size="md">
          Edit Profile
        </Heading>
      </Box>
      <Divider />
      <Box paddingX="16px">
        <Heading size="sm" marginY={4}>
          Account Info
        </Heading>
        <ProfileImageManager
          // upload={false}
          onSubmit={handleOnImageUpdate}
          defaultImages={userData.images}
          cells={6}
          buttonText="UPDATE IMAGES"
        />
      </Box>
    </Box>
  );
};

export default Info;

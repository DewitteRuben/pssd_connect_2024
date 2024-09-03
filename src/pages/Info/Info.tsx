import { Box, Heading, Input, Select, Textarea, useToast } from "@chakra-ui/react";
import { useStore } from "../../store/store";
import ProfileImageManager from "../../components/ProfileImageManager";
import { ImagePickerEntry } from "../../components/ImagePicker";
import React, { ChangeEventHandler } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import Header from "../../components/Header";
import { Gender, UserProfile } from "../../backend/src/database/user/types";

const Info = () => {
  const { user: userStore } = useStore();
  const toast = useToast();
  const userData = userStore.user;

  const [profile, setProfile] = React.useState<Partial<UserProfile>>(
    userData?.profile ?? {}
  );

  const [gender, setGender] = React.useState<string>(userData?.gender ?? "");

  const updateProfileDebounced = useDebouncedCallback((updatedProfile) => {
    userStore.updateUser({ profile: { ...updatedProfile } });
    toast({
      title: "Profile",
      description: "We've successfully updated your profile",
      status: "success",
      isClosable: true,
    });
  }, 800);

  const updateProfile =
    (type: keyof UserProfile): ChangeEventHandler<any> =>
    (event) => {
      setProfile((p) => {
        const updatedState = { ...p, [type]: event.target.value };
        updateProfileDebounced(updatedState);
        return updatedState;
      });
    };

  const onGenderChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setGender(event.target.value);
    userStore.updateUser({ gender: event.target.value as Gender });

    toast({
      title: "Gender",
      description: "We've successfully updated how you identify",
      status: "success",
      isClosable: true,
    });
  };

  const handleOnImageUpdate = (images: string[] | ImagePickerEntry[]) => {
    userStore.updateUser({ images: images as string[] });

    toast({
      title: "Images",
      description: "We've successfully updated your images",
      status: "success",
      isClosable: true,
    });
  };

  return (
    <Box>
      <Header path="/profile" title="Edit profile" />
      <Box paddingX="16px">
        <Box marginY={4}>
          <ProfileImageManager
            onSubmit={handleOnImageUpdate}
            defaultImages={userData?.images ?? []}
            cells={6}
            buttonText="UPDATE IMAGES"
          />
        </Box>
        <Heading size="sm" marginY={4}>
          About {userData?.firstName ?? ""}
        </Heading>
        <Textarea
          value={profile.about}
          resize="none"
          placeholder="About you"
          onChange={updateProfile("about")}
        />
        <Heading size="sm" marginY={4}>
          Job Title
        </Heading>
        <Input
          value={profile.jobTitle}
          placeholder="Add Job Title"
          onChange={updateProfile("jobTitle")}
        />
        <Heading size="sm" marginY={4}>
          Company
        </Heading>
        <Input
          value={profile.company}
          placeholder="Add Company"
          onChange={updateProfile("company")}
        />
        <Heading size="sm" marginY={4}>
          School
        </Heading>
        <Input
          value={profile.school}
          placeholder="Add School"
          onChange={updateProfile("school")}
        />
        <Heading size="sm" marginY={4}>
          Living in
        </Heading>
        <Input
          placeholder="Add City"
          value={profile.city}
          onChange={updateProfile("city")}
        />
        <Heading size="sm" marginY={4}>
          I identify as
        </Heading>
        <Select value={gender} onChange={onGenderChange} marginY={4}>
          <option value="man">Man</option>
          <option value="woman">Woman</option>
        </Select>
      </Box>
    </Box>
  );
};

export default Info;

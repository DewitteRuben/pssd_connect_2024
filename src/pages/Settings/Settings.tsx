import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  IconButton,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import AgeRangeSlider from "../../components/AgeRangeSlider";
import DistanceSlider from "../../components/DistanceSlider";
import React from "react";
import Header from "../../components/Header";

const Settings = () => {
  const { user: userStore } = useStore();
  const navigate = useNavigate();
  const toast = useToast();

  const userData = userStore.user;

  const [isGlobal, setIsGlobal] = React.useState(userData?.preferences.global ?? false);

  if (!userData) {
    throw new Error("Invalid state! User not found");
  }

  const prettyGenderPreference = () => {
    const genderPreference = userData.preferences.genderPreference;
    return genderPreference.charAt(0).toUpperCase() + genderPreference.slice(1);
  };

  const handleGlobalToggle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsGlobal(ev.target.checked);
    userStore.updateUser({ preferences: { global: ev.target.checked } });
  };

  const handleOnAgeRangeChange = async ({ min, max }: { min: number; max: number }) => {
    try {
      await userStore.updateUser({ preferences: { ageStart: min, ageEnd: max } });
      toast({
        title: "Preferred age range",
        description: "We've successfully updated your prefered age range",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update age range", error);
      toast({
        title: "Preferred age range",
        description: "Failed to update your prefered age range",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleOnDistanceChange = async (maxDistance: number) => {
    try {
      await userStore.updateUser({ preferences: { maxDistance } });
      toast({
        title: "Max. distance",
        description: "We've successfully updated your max. distance",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update age range", error);
      toast({
        title: "Max. distance",
        description: "Failed to update your max. distance",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Header path="/profile" title="Settings"/>
      <Box paddingX="16px" paddingBottom="16px">
        <Heading size="sm" marginY={4}>
          Account settings
        </Heading>
        <Card>
          <CardBody>
            <Box display="flex" justifyContent="space-between">
              <Text>Phone number</Text>
              <Text>
                {userData.countryCode} {userData.phoneNumber}
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Heading size="sm" marginY={4}>
          Discovery settings
        </Heading>
        <Card>
          <CardBody>
            <Box display="flex" justifyContent="space-between">
              <Text>Now looking in</Text>
              <Text>
                {userData.preferences.global
                  ? "Globally"
                  : userData.location.coords.latitude}
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                I'm interested in
              </Heading>
              <Text>{prettyGenderPreference()}</Text>
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                marginBottom={2}
              >
                <Heading color="green" size="xs">
                  Global
                </Heading>
                <Switch
                  onChange={handleGlobalToggle}
                  isChecked={isGlobal}
                  size="md"
                  marginLeft={4}
                />
              </Box>
              <Text fontSize="sm">
                Going global will allow you to see people nearby and from around the world
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                Max. distance
              </Heading>
              {userData.preferences.global && (
                <Text color="darkred" marginBottom={2} fontSize="xs">
                  Global mode is enabled, the max. distance is ignored.
                </Text>
              )}

              <DistanceSlider
                onChange={handleOnDistanceChange}
                max={userData.preferences.maxDistance}
              />
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" marginBottom={2} size="xs">
                Age range
              </Heading>
              <AgeRangeSlider
                onChange={handleOnAgeRangeChange}
                start={userData.preferences.ageStart}
                end={userData.preferences.ageEnd}
              />
            </Box>
          </CardBody>
        </Card>
        <Heading size="sm" marginY={4}>
          Account maintenance
        </Heading>
        <Button colorScheme="green" size="md" type="submit">
          Remove account
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;

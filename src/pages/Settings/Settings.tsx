import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  IconButton,
  Select,
  Stack,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useStore } from "../../store/store";
import AgeRangeSlider from "../../components/AgeRangeSlider";
import DistanceSlider from "../../components/DistanceSlider";
import React from "react";
import Header from "../../components/Header";
import RemoveAccountModal from "../../components/RemoveAccountModal";
import { requestGeolocation } from "../../components/LocationButton";
import {
  DistanceUnit,
  GenderPreference,
  genderPreferences,
  UserLocation,
} from "../../backend/src/database/user/types";
import { capitalize } from "lodash";
import { observer } from "mobx-react";
import LogoutAccountDialog from "../../components/LogoutAccountDialog";
import AllowNotificationButton from "../../components/AllowNotificationButton";

const notificationPermissionStatusText = (notificationToken?: string) => {
  if (Notification.permission === "denied") return "Denied (requires reset in browser)";

  if (Notification.permission === "granted") {
    if (notificationToken) return "Allowed";

    return "Incomplete";
  }

  return "Unset";
};

const Settings = () => {
  const { user: userStore } = useStore();
  const toast = useToast();

  const userData = userStore.user;

  const [selectedGenderPref, setSelectedGenderPref] = React.useState(
    userData?.preferences.genderPreference ?? ""
  );

  const [distanceUnit, setDistanceUnit] = React.useState<DistanceUnit>(
    userData?.distanceUnit ?? "km"
  );

  const [isGlobal, setIsGlobal] = React.useState(userData?.preferences.global ?? false);
  const [grabbingLocation, setGrabbingLocation] = React.useState(false);

  if (!userData) {
    throw new Error("Invalid state! User not found");
  }

  const handleGlobalToggle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsGlobal(ev.target.checked);
    userStore.updateUser({ preferences: { global: ev.target.checked } });
  };

  const handleOnNotificationToken = async (token: string) => {
    try {
      await userStore.updateUser({
        notificationToken: token,
      });

      toast({
        title: "Notifications",
        description: "We've successfully updated your notification preferences",
        status: "success",
        isClosable: true,
      });

      userStore.fetchUserMetadata();
    } catch (error) {
      console.error("Failed to update notification settings", error);
    }
  };

  const updateLocation = async () => {
    try {
      setGrabbingLocation(true);
      const location = await requestGeolocation();

      await userStore.updateUser({
        location: {
          type: "Point",
          coordinates: [location.coords.longitude, location.coords.latitude],
        } as UserLocation,
      });

      toast({
        title: "Location",
        description: "We've successfully updated your location",
        status: "success",
        isClosable: true,
      });

      userStore.fetchUserMetadata();
    } catch (error) {
      console.error("Failed to update location", error);
    } finally {
      setGrabbingLocation(false);
    }
  };

  const updateGenderPreference = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setSelectedGenderPref(event.target.value);
      await userStore.updateUser({
        preferences: { genderPreference: event.target.value as GenderPreference },
      });

      toast({
        title: "Gender preference",
        description: "We've successfully updated your gender preference",
        status: "success",
        isClosable: true,
      });

      userStore.fetchUserMetadata();
    } catch (error) {
      console.error("Failed to gender preference", error);
    }
  };

  const updateDistanceUnit = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const distanceUnit = event.target.value;

      setDistanceUnit(distanceUnit);

      await userStore.updateUser({
        distanceUnit,
      });

      toast({
        title: "Distance unit",
        description: "We've successfully updated your preferred distance unit",
        status: "success",
        isClosable: true,
      });

      userStore.fetchUserMetadata();
    } catch (error) {
      console.error("Failed to gender preference", error);
    }
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
      <Header path="/profile" title="Settings" />
      <Box paddingX="16px" paddingBottom="16px">
        <Heading size="sm" marginY={4}>
          Account settings
        </Heading>
        <Card>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                Phone number
              </Heading>
              <Text color="grey" marginBottom={2} fontSize="xs">
                Your phone number is not visible to others.
              </Text>
              <Text>
                {userData.countryCode} {userData.phoneNumber}
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                Distance unit
              </Heading>
              <Select onChange={updateDistanceUnit} value={distanceUnit} marginTop={2}>
                <option value="km">Kilometers</option>
                <option value="mi">Miles</option>
              </Select>
            </Box>
          </CardBody>
        </Card>
        <Heading size="sm" marginY={4}>
          Discovery settings
        </Heading>
        <Card>
          <CardBody>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Heading color="green" size="xs">
                  Now looking
                </Heading>
                <Text color="grey" marginBottom={2} fontSize="xs">
                  Your current location is not visible to others.
                </Text>
              </Box>
              <Text fontSize="sm">{userData.preferences.global ? "Globally" : ""}</Text>
            </Box>
            <Box marginTop={4} display="flex" justifyContent="space-between">
              <Button
                onClick={updateLocation}
                isLoading={grabbingLocation}
                size="md"
                colorScheme="green"
              >
                Update location
              </Button>
              <Box textAlign="right">
                <Text fontSize="xs">{userData.country}</Text>
                <Text fontSize="xs">{userData.city}</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                I'm interested in
              </Heading>
              <Select
                value={selectedGenderPref}
                onChange={updateGenderPreference}
                marginTop={2}
              >
                {genderPreferences.map((gp) => (
                  <option value={gp} key={gp}>
                    {capitalize(gp)}
                  </option>
                ))}
              </Select>
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
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                Notification settings
              </Heading>
              <Box marginTop={4} display="flex" justifyContent="space-between">
                <AllowNotificationButton onChange={handleOnNotificationToken} size="md" />
                <Text fontSize="sm">
                  {notificationPermissionStatusText(userData.notificationToken)}
                </Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
        <Heading size="sm" marginY={4}>
          Account maintenance
        </Heading>
        <Stack>
          <RemoveAccountModal />
          <LogoutAccountDialog />
        </Stack>
      </Box>
    </Box>
  );
};

export default observer(Settings);

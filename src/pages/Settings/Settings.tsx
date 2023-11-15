import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Divider,
  Heading,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import AgeRangeSlider from "../../components/AgeRangeSlider";

const Settings = () => {
  const {
    user: { user: userData },
  } = useStore();
  const navigate = useNavigate();

  if (!userData) {
    throw new Error("Invalid state! User not found");
  }

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
          Settings
        </Heading>
      </Box>
      <Divider />
      <Box paddingX="16px">
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
              <Text>{userData.location.coords.latitude}</Text>
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                I'm interest in
              </Heading>
              <Text>{userData.preferences.genderPreference}</Text>
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
                  defaultChecked={userData.preferences.global}
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
              <Text>{userData.preferences.maxDistance} km</Text>
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
                start={userData.preferences.ageStart}
                end={userData.preferences.ageEnd}
              />
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default Settings;

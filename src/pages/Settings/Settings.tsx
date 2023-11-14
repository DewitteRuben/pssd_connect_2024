import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Divider,
  Heading,
  IconButton,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const Settings = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  if (!user.user) {
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
                {user.user.countryCode} {user.user.phoneNumber}
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
              <Text>{user.user.location.coords.latitude}</Text>
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                I'm interest in
              </Heading>
              <Text>{user.user.prefGender}</Text>
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
                <Switch size="md" marginLeft={4} />
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
              <Text>72km</Text>
            </Box>
          </CardBody>
        </Card>
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                Age range
              </Heading>
              <Text>72km</Text>
            </Box>
          </CardBody>
        </Card> 
        <Card marginY={4}>
          <CardBody>
            <Box>
              <Heading color="green" size="xs">
                Age range
              </Heading>
              <Text>72km</Text>
            </Box>
          </CardBody>
        </Card> 
      </Box>
    </Box>
  );
};

export default Settings;

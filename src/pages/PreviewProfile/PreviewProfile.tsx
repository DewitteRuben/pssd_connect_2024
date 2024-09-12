import {
  Box,
  Card,
  CardBody,
  Divider,
  Heading,
  IconButton,
  Image,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import Header from "../../components/Header";
import { differenceInYears } from "date-fns";
import { useStore } from "../../store/store";
import React from "react";
import { InfoIcon, SwipeableCard } from "../Match/Match";
import { FaArrowDown, FaHeart } from "react-icons/fa";
import {
  MdOutlineWorkOutline,
  MdOutlineSchool,
  MdOutlineHouse,
  MdOutlineLocationOn,
  MdClose,
} from "react-icons/md";
import { prettyPSSDDuration } from "../../backend/src/database/user/types";
import { useUnitDistance } from "../../utils/math";

export const PreviewProfile = () => {
  const {
    user: { user: userData },
  } = useStore();

  const [viewProfile, setViewProfile] = React.useState(false);
  const [screenWidth, setScreenWidth] = React.useState(window.screen.width);

  const unitDistance = useUnitDistance(0);

  React.useLayoutEffect(() => {
    const resizeListener = () => {
      setScreenWidth(window.screen.width);
    };

    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  if (!userData) return null;

  return (
    <>
      <Header path="/profile" title="Profile preview" />
      <Box overflow="hidden">
        <SwipeableCard
          swipeRequirementType="position"
          swipeThreshold={Math.floor(screenWidth / 2)}
          preventSwipe={["up", "down"]}
        >
          <Box position="relative">
            <Box position="relative">
              <Image
                maxHeight="640px"
                maxWidth="640px"
                width="100%"
                aspectRatio="7 / 10"
                src={userData?.images[0]}
              />
            </Box>

            <Box
              onClick={() => setViewProfile((vp) => !vp)}
              position="absolute"
              bottom="0"
              padding="18px"
              width="100%"
              backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9));"
            >
              <Box position="relative">
                <Text fontWeight="bold" color="white" fontSize="24px">
                  {userData.firstName},{" "}
                  {differenceInYears(new Date(), new Date(userData.birthdate) as Date)}
                </Text>
                <Text color="white" fontSize="16px">
                  {userData.profile.jobTitle ?? userData.profile.school}
                </Text>
                <InfoIcon color="white" />
              </Box>
            </Box>
          </Box>
        </SwipeableCard>
      </Box>
      <Box
        position="absolute"
        bottom="calc(42px + env(safe-area-inset-bottom))"
        width="100%"
        zIndex={100}
      >
        {viewProfile && (
          <Card position="relative">
            <CardBody>
              <Box overflow="scroll" minH={300} maxH={340}>
                <Text marginBottom={2} fontWeight="bold" color="black" fontSize="24px">
                  {userData.firstName},{" "}
                  {differenceInYears(new Date(), new Date(userData.birthdate) as Date)}
                </Text>
                <List>
                  {userData.profile.jobTitle && (
                    <ListItem>
                      <ListIcon as={MdOutlineWorkOutline} />
                      {userData.profile.jobTitle}
                    </ListItem>
                  )}
                  {userData.profile.school && (
                    <ListItem>
                      <ListIcon as={MdOutlineSchool} />
                      {userData.profile.school}
                    </ListItem>
                  )}
                  {userData.profile.city && (
                    <ListItem>
                      <ListIcon as={MdOutlineHouse} />
                      Lives in {userData.profile.city}
                    </ListItem>
                  )}
                  <ListItem>
                    <ListIcon as={MdOutlineLocationOn} />
                    {unitDistance} away
                  </ListItem>
                </List>
                <Divider marginY={6}></Divider>
                {userData.profile.about && (
                  <Box paddingRight="16px">
                    <Heading marginBottom={2} marginTop={4} size="s">
                      About me
                    </Heading>
                    <Text>{userData.profile.about}</Text>
                  </Box>
                )}
                <Heading marginBottom={2} marginTop={4} size="s">
                  PSSD Information
                </Heading>

                <Box marginBottom={4}>
                  <Text>Duration:</Text>
                  {userData.pssd.duration && (
                    <Text>{prettyPSSDDuration(userData.pssd.duration)}</Text>
                  )}
                </Box>

                {userData.pssd.medications.length > 0 && (
                  <Box marginBottom={4}>
                    <Text>Medications:</Text>
                    <List paddingLeft="16px" styleType="'- '">
                      {userData.pssd.medications.map((med, index) => (
                        <ListItem key={`${med}-${index}`}>{med}</ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {userData.pssd.symptoms.length > 0 && (
                  <Box marginBottom={4}>
                    <Text>Symptoms:</Text>
                    <List paddingLeft="16px" styleType="'- '">
                      {userData.pssd.symptoms.map((symp, index) => (
                        <ListItem key={`${symp}-${index}`}>{symp}</ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </CardBody>

            <IconButton
              isRound={true}
              onClick={() => setViewProfile((vp) => !vp)}
              variant="solid"
              right="15px"
              top="-15px"
              aria-label="undo"
              position="absolute"
              colorScheme="red"
              size="md"
              icon={<FaArrowDown color="white" />}
            />
          </Card>
        )}
      </Box>
    </>
  );
};

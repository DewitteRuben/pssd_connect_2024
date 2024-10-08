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

import { useStore } from "../../store/store";
import { FaArrowDown, FaHeart } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import {
  MdClose,
  MdOutlineHouse,
  MdOutlineLocationOn,
  MdOutlineSchool,
  MdOutlineWorkOutline,
} from "react-icons/md";

import styled from "styled-components";
import React from "react";
import { observer } from "mobx-react";
import { differenceInYears } from "date-fns";
import { prettyPSSDDuration } from "../../backend/src/database/user/types";
import { kmToMiles, useUnitDistance } from "../../utils/math";
import TinderCard from "react-tinder-card";

export const InfoIcon = styled(IoIosInformationCircle)`
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
`;

export const SwipeableCard = styled(TinderCard)`
  position: absolute;
  width: 100%;
`;

const SwipeableCardContainer = styled(Box)``;

const Match = () => {
  const {
    user: { user: userData },
    relationship,
  } = useStore();

  const [viewProfile, setViewProfile] = React.useState(false);
  const [screenWidth, setScreenWidth] = React.useState(window.screen.width);
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  }>();

  const swipeableRefs = React.useRef<Map<string, any> | null>(null);
  const imageRefs = React.useRef<Map<string, HTMLImageElement> | null>(null);

  const [endOfStackReached, setEndOfStackReached] = React.useState(false);
  const unitDistance = useUnitDistance(relationship?.currentSuggestion?.distance ?? 0);

  function getSwipeableRefsMap() {
    if (!swipeableRefs.current) {
      swipeableRefs.current = new Map();
    }
    return swipeableRefs.current;
  }

  function getImageRefsMap() {
    if (!imageRefs.current) {
      imageRefs.current = new Map();
    }
    return imageRefs.current;
  }

  React.useLayoutEffect(() => {
    const updateImageDimensions = () => {
      const map = getImageRefsMap();
      if (relationship.currentSuggestion) {
        const image = map.get(relationship.currentSuggestion?.uid);
        if (image) {
          const { width, height } = image.getBoundingClientRect();

          setImageDimensions({ width, height });
        }
      }
    };

    const resizeListener = () => {
      setScreenWidth(window.screen.width);
      updateImageDimensions();
    };

    updateImageDimensions();

    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [imageRefs, relationship.currentSuggestion, relationship.index]);

  React.useEffect(() => {
    if (relationship.index >= 0) {
      if (endOfStackReached) {
        setEndOfStackReached(false);
      }
    }
  }, [endOfStackReached, relationship.index]);

  if (!userData) throw new Error("User data was not found");

  const onSwipe = (direction: string, uid: string, index: number) => {
    switch (direction) {
      case "left":
        relationship.dislike(uid);
        break;
      case "right":
        relationship.like(uid);
        break;
    }

    relationship.updateIndex(relationship.index - 1);
  };

  const onCardLeftScreen = () => {
    if (relationship.index < 0) {
      setEndOfStackReached(true);

      setTimeout(() => {
        relationship.clear();
      }, 1500);
    }
  };

  if (endOfStackReached) {
    return (
      <Box
        display="flex"
        height="100%"
        padding="0 30px"
        textAlign="center"
        justifyContent="center"
        alignItems="center"
        background="1px solid black"
      >
        <Text>
          You've reached the end of the list, please check back later for more potential
          matches.
        </Text>
      </Box>
    );
  }

  if (relationship.relationships?.suggestions_info?.length === 0)
    return (
      <Box
        display="flex"
        height="100%"
        padding="0 30px"
        textAlign="center"
        justifyContent="center"
        alignItems="center"
        background="1px solid black"
      >
        <Text>
          We've run out of potential matches for you, please check back at a later time.
        </Text>
      </Box>
    );

  // If the relationship array is null, the relationshps haven't loaded yet
  if (relationship.relationships == null) return null;

  return (
    <>
      <Box overflow="hidden">
        {relationship.relationships.suggestions_info.map((si, index) => (
          <SwipeableCardContainer key={si.uid}>
            <SwipeableCard
              ref={(el) => {
                const map = getSwipeableRefsMap();
                if (el) {
                  map.set(si.uid, el);
                } else {
                  map.delete(si.uid);
                }
              }}
              swipeRequirementType="position"
              onCardLeftScreen={onCardLeftScreen}
              onSwipe={(direction) => onSwipe(direction, si.uid, index)}
              swipeThreshold={Math.floor(screenWidth / 2)}
              preventSwipe={["up", "down"]}
            >
              <Box position="relative">
                <Box position="relative">
                  <Image
                    maxHeight="640px"
                    maxWidth="640px"
                    ref={(el) => {
                      const map = getImageRefsMap();
                      if (el) {
                        map.set(si.uid, el);
                      } else {
                        map.delete(si.uid);
                      }
                    }}
                    width="100%"
                    aspectRatio="7 / 10"
                    src={si.images[0]}
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
                      {si.firstName},{" "}
                      {differenceInYears(new Date(), new Date(si.birthdate) as Date)}
                    </Text>
                    <Text color="white" fontSize="16px">
                      {si.profile.jobTitle ?? si.profile.school}
                    </Text>
                    <InfoIcon color="white" />
                  </Box>
                </Box>
              </Box>
            </SwipeableCard>
          </SwipeableCardContainer>
        ))}
      </Box>
      <Box
        position="absolute"
        bottom="calc(42px + env(safe-area-inset-bottom))"
        width="100%"
        zIndex={100}
      >
        {viewProfile && relationship.currentSuggestion && (
          <Card position="relative">
            <CardBody>
              <Box overflow="scroll" minH={300} maxH={340}>
                <Text marginBottom={2} fontWeight="bold" color="black" fontSize="24px">
                  {relationship.currentSuggestion.firstName},{" "}
                  {differenceInYears(
                    new Date(),
                    new Date(relationship.currentSuggestion.birthdate) as Date
                  )}
                </Text>
                <List>
                  {relationship.currentSuggestion.profile.jobTitle && (
                    <ListItem>
                      <ListIcon as={MdOutlineWorkOutline} />
                      {relationship.currentSuggestion.profile.jobTitle}
                    </ListItem>
                  )}
                  {relationship.currentSuggestion.profile.school && (
                    <ListItem>
                      <ListIcon as={MdOutlineSchool} />
                      {relationship.currentSuggestion.profile.school}
                    </ListItem>
                  )}
                  {relationship.currentSuggestion.profile.city && (
                    <ListItem>
                      <ListIcon as={MdOutlineHouse} />
                      Lives in {relationship.currentSuggestion.profile.city}
                    </ListItem>
                  )}
                  <ListItem>
                    <ListIcon as={MdOutlineLocationOn} />
                    {unitDistance} away
                  </ListItem>
                </List>
                <Divider marginY={6}></Divider>
                {relationship.currentSuggestion.profile.about && (
                  <Box paddingRight="16px">
                    <Heading marginBottom={2} marginTop={4} size="s">
                      About me
                    </Heading>
                    <Text>{relationship.currentSuggestion.profile.about}</Text>
                  </Box>
                )}
                <Heading marginBottom={2} marginTop={4} size="s">
                  PSSD Information
                </Heading>

                <Box marginBottom={4}>
                  <Text>Duration:</Text>
                  {relationship.currentSuggestion.pssd.duration && (
                    <Text>
                      {prettyPSSDDuration(relationship.currentSuggestion.pssd.duration)}
                    </Text>
                  )}
                </Box>

                {relationship.currentSuggestion.pssd.medications.length > 0 && (
                  <Box marginBottom={4}>
                    <Text>Medications:</Text>
                    <List paddingLeft="16px" styleType="'- '">
                      {relationship.currentSuggestion.pssd.medications.map(
                        (med, index) => (
                          <ListItem key={`${med}-${index}`}>{med}</ListItem>
                        )
                      )}
                    </List>
                  </Box>
                )}

                {relationship.currentSuggestion.pssd.symptoms.length > 0 && (
                  <Box marginBottom={4}>
                    <Text>Symptoms:</Text>
                    <List paddingLeft="16px" styleType="'- '">
                      {relationship.currentSuggestion.pssd.symptoms.map((symp, index) => (
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
      <Box
        display="flex"
        justifyContent="center"
        gap="40px"
        paddingTop={`${imageDimensions?.height}px`}
        marginTop={4}
      >
        <IconButton
          isRound={true}
          variant="solid"
          width="60px"
          height="60px"
          aria-label="dislike"
          fontSize="36px"
          onClick={() => {
            const map = getSwipeableRefsMap();
            if (relationship.currentSuggestion) {
              map.get(relationship.currentSuggestion.uid).swipe("left");
            }
          }}
          icon={<MdClose color="red" />}
        />
        <IconButton
          isRound={true}
          variant="solid"
          width="60px"
          height="60px"
          fontSize="24px"
          aria-label="like"
          onClick={() => {
            const map = getSwipeableRefsMap();
            if (relationship.currentSuggestion) {
              map.get(relationship.currentSuggestion.uid).swipe("right");
            }
          }}
          icon={<FaHeart color="green" />}
        />
      </Box>
    </>
  );
};

export default observer(Match);

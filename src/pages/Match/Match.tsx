import {
  Box,
  Button,
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
import { FaArrowDown, FaHeart, FaPills, FaUndo } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import {
  MdClose,
  MdOutlineLocationOn,
  MdOutlineSchool,
  MdOutlineWorkOutline,
} from "react-icons/md";
import Swipable from "react-tinder-card";

import styled from "styled-components";
import React, { useLayoutEffect } from "react";
import { observer } from "mobx-react";
import "./Match.css";
import { toJS } from "mobx";
import { differenceInYears } from "date-fns";
import { prettyPSSDDuration } from "../../backend/src/database/user/types";

const InfoIcon = styled(IoIosInformationCircle)`
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
`;

const Match = () => {
  const {
    user: { user: userData },
    relationship,
  } = useStore();

  const [viewProfile, setViewProfile] = React.useState(false);
  const [screenWidth, setScreenWidth] = React.useState(window.screen.width);
  const [cardHeight, setCardHeight] = React.useState(0);
  const [endOfStackReached, setEndOfStackReached] = React.useState(false);
  const [fulfilledState, setFulfilledState] = React.useState<
    "left" | "right" | "up" | "down"
  >();

  if (!userData) throw new Error("User data was not found");

  const swipableRefs = (relationship.relationships?.suggestions_info ?? []).map(() =>
    React.createRef()
  ) as any;

  const containerRefs = (relationship.relationships?.suggestions_info ?? []).map(() =>
    React.createRef()
  ) as any;

  React.useLayoutEffect(() => {
    const resizeListener = () => {
      setScreenWidth(window.screen.width);
    };

    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  React.useEffect(() => {
    if (relationship.index >= 0) {
      if (endOfStackReached) {
        setEndOfStackReached(false);
      }
    }
  }, [relationship.index]);

  // Adjust infocard offset based on the image's height
  useLayoutEffect(() => {
    setCardHeight(containerRefs[relationship.index].current.clientHeight);
  }, [
    relationship.index,
    containerRefs[relationship.index],
    containerRefs[relationship.index].current,
  ]);

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

  if (!relationship.relationships?.suggestions_info.length)
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

  return (
    <>
      <Box display="flex" maxWidth="640px" height="640px" overflow="hidden">
        {relationship.relationships.suggestions_info.map((si, index) => (
          <Box key={si.uid}>
            <Swipable
              swipeRequirementType="position"
              ref={swipableRefs[index]}
              onCardLeftScreen={onCardLeftScreen}
              onSwipe={(direction) => onSwipe(direction, si.uid, index)}
              onSwipeRequirementFulfilled={setFulfilledState}
              onSwipeRequirementUnfulfilled={() => setFulfilledState(undefined)}
              swipeThreshold={Math.floor(screenWidth / 2)}
              preventSwipe={["up", "down"]}
              className="Match-card"
            >
              <Box ref={containerRefs[index]} position="relative">
                <Image
                  maxHeight="640px"
                  maxWidth="640px"
                  width="100%"
                  aspectRatio="7 / 10"
                  src={si.images[0]}
                />

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
            </Swipable>
            <Box zIndex={2} position="absolute" width="100%" top={cardHeight - 340}>
              {viewProfile && (
                <Card position="relative">
                  <CardBody>
                    <Box height={300} overflow="scroll">
                      <Text
                        marginBottom={2}
                        fontWeight="bold"
                        color="black"
                        fontSize="24px"
                      >
                        {si.firstName},{" "}
                        {differenceInYears(new Date(), new Date(si.birthdate) as Date)}
                      </Text>
                      <List>
                        {si.profile.jobTitle && (
                          <ListItem>
                            <ListIcon as={MdOutlineWorkOutline} />
                            {si.profile.jobTitle}
                          </ListItem>
                        )}
                        {si.profile.school && (
                          <ListItem>
                            <ListIcon as={MdOutlineSchool} />
                            {si.profile.school}
                          </ListItem>
                        )}
                        <ListItem>
                          <ListIcon as={MdOutlineLocationOn} />
                          {si.location.country}, {si.location.city}
                        </ListItem>
                      </List>
                      <Divider marginY={6}></Divider>
                      <Heading marginBottom={2} marginTop={4} size="s">
                        PSSD Information
                      </Heading>

                      <Box marginBottom={4}>
                        <Text>Duration:</Text>
                        {si.pssd.duration && (
                          <Text>{prettyPSSDDuration(si.pssd.duration)}</Text>
                        )}
                      </Box>

                      <Box marginBottom={4}>
                        <Text>Medications:</Text>
                        <List paddingLeft="16px" styleType="'- '">
                          {si.pssd.medications.map((med, index) => (
                            <ListItem key={`${med}-${index}`}>{med}</ListItem>
                          ))}
                        </List>
                      </Box>

                      <Box marginBottom={4}>
                        <Text>Symptoms:</Text>
                        <List paddingLeft="16px" styleType="'- '">
                          {si.pssd.symptoms.map((symp, index) => (
                            <ListItem key={`${symp}-${index}`}>{symp}</ListItem>
                          ))}
                        </List>
                      </Box>
                      {si.profile.about && (
                        <Box paddingRight="16px">
                          <Divider marginY={6}></Divider>
                          <Heading marginBottom={2} marginTop={4} size="s">
                            About me
                          </Heading>
                          <Text>{si.profile.about}</Text>
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
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" gap="40px">
        <IconButton
          isRound={true}
          variant="solid"
          width="60px"
          height="60px"
          aria-label="dislike"
          fontSize="36px"
          onClick={() => {
            if (relationship.currentSuggestion) {
              swipableRefs[relationship.index].current.swipe("left");
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
            if (relationship.currentSuggestion) {
              swipableRefs[relationship.index].current.swipe("right");
            }
          }}
          icon={<FaHeart color="green" />}
        />
      </Box>
    </>
  );
};

export default observer(Match);

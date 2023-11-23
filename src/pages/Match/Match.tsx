import {
  Box,
  Card,
  CardBody,
  IconButton,
  Image,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import Swipeable from "react-tinder-card";
import woman from "../../woman.jpg"; // Tell webpack this JS file uses this image
import { useStore } from "../../store/store";
import { differenceInYears } from "date-fns";
import { FaArrowDown, FaHeart, FaUndo } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import {
  MdOutlineWorkOutline,
  MdOutlineSchool,
  MdClose,
  MdOutlineLocationOn,
} from "react-icons/md";
import { Divider } from "@chakra-ui/react";

import styled from "styled-components";
import React from "react";

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
  } = useStore();

  const [viewProfile, setViewProfile] = React.useState(false);

  if (!userData) throw new Error("User data was not found");

  const onSwipe = (direction: string) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
  };

  return (
    <Box display="flex" flexDirection="column" overflowX="hidden" height="100%">
      {!viewProfile && (
        <Swipeable
          onSwipe={onSwipe}
          onCardLeftScreen={() => onCardLeftScreen("fooBar")}
          preventSwipe={["up", "down"]}
        >
          <Box position="relative">
            <Image src={woman} />

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
        </Swipeable>
      )}
      {viewProfile && (
        <Box position="relative">
          <Image src={woman} />

          <Box position="absolute" width="100%" bottom="0">
            <Card position="relative">
              <CardBody>
                <Text marginBottom={2} fontWeight="bold" color="black" fontSize="24px">
                  {userData.firstName},{" "}
                  {differenceInYears(new Date(), new Date(userData.birthdate) as Date)}
                </Text>
                <List>
                  <ListItem>
                    <ListIcon as={MdOutlineWorkOutline} />
                    {userData.profile.jobTitle}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdOutlineSchool} />
                    {userData.profile.school}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdOutlineLocationOn} />
                    {userData.location.coords.longitude}
                  </ListItem>
                </List>
                <Divider marginY={6}></Divider>
                <Text>{userData.profile.about}</Text>
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
          </Box>
        </Box>
      )}
      <Box display="flex" justifyContent="center" marginTop="16px" gap="40px">
        <IconButton
          isRound={true}
          variant="solid"
          width="60px"
          height="60px"
          fontSize="24px"
          aria-label="undo"
          icon={<FaUndo color="blue" />}
        />
        <IconButton
          isRound={true}
          variant="solid"
          width="60px"
          height="60px"
          aria-label="undo"
          fontSize="36px"
          icon={<MdClose color="red" />}
        />
        <IconButton
          isRound={true}
          variant="solid"
          width="60px"
          height="60px"
          fontSize="24px"
          aria-label="undo"
          icon={<FaHeart color="green" />}
        />
      </Box>
    </Box>
  );
};

export default Match;

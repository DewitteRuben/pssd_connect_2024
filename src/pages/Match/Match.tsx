import {
  Box,
  Button,
  Card,
  CardBody,
  IconButton,
  Image,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";

import { useStore } from "../../store/store";
import { FaArrowDown, FaHeart, FaUndo } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { MdClose } from "react-icons/md";
import Swipable from "react-tinder-card";

import styled from "styled-components";
import React from "react";
import { observer } from "mobx-react";
import "./Match.css";
import { toJS } from "mobx";

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
  const [endOfStackReached, setEndOfStackReached] = React.useState(false);
  const [fulfilledState, setFulfilledState] = React.useState<
    "left" | "right" | "up" | "down"
  >();

  if (!userData) throw new Error("User data was not found");

  React.useEffect(() => {
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

  const onSwipe = (direction: string, uid: string, index: number) => {
    switch (direction) {
      case "left":
        // relationship.dislike(uid);
        break;
      case "right":
        // relationship.like(uid);
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

  const swipableRefs = (relationship.relationships?.suggestions_info ?? []).map(() =>
    React.createRef()
  ) as any;

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

  if (!relationship.relationships)
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
          <Swipable
            swipeRequirementType="position"
            ref={swipableRefs[index]}
            onCardLeftScreen={onCardLeftScreen}
            onSwipe={(direction) => onSwipe(direction, si.uid, index)}
            onSwipeRequirementFulfilled={setFulfilledState}
            onSwipeRequirementUnfulfilled={() => setFulfilledState(undefined)}
            swipeThreshold={Math.floor(screenWidth / 2)}
            preventSwipe={["up", "down"]}
            key={si.uid}
            className="Match-card"
          >
            <Image
              maxHeight="640px"
              maxWidth="640px"
              width="100%"
              aspectRatio="7 / 10"
              src={si.images[0]}
            />
          </Swipable>
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

  // {viewProfile && (
  //   <Box position="relative">
  //     <Image src={woman} />

  //     <Box position="absolute" width="100%" bottom="0">
  //       <Card position="relative">
  //         <CardBody>
  //           <Text marginBottom={2} fontWeight="bold" color="black" fontSize="24px">
  //             {userData.firstName},{" "}
  //             {differenceInYears(new Date(), new Date(userData.birthdate) as Date)}
  //           </Text>
  //           <List>
  //             <ListItem>
  //               <ListIcon as={MdOutlineWorkOutline} />
  //               {userData.profile.jobTitle}
  //             </ListItem>
  //             <ListItem>
  //               <ListIcon as={MdOutlineSchool} />
  //               {userData.profile.school}
  //             </ListItem>
  //             <ListItem>
  //               <ListIcon as={MdOutlineLocationOn} />
  //               {userData.location.coords.longitude}
  //             </ListItem>
  //           </List>
  //           <Divider marginY={6}></Divider>
  //           <Text>{userData.profile.about}</Text>
  //         </CardBody>

  //         <IconButton
  //           isRound={true}
  //           onClick={() => setViewProfile((vp) => !vp)}
  //           variant="solid"
  //           right="15px"
  //           top="-15px"
  //           aria-label="undo"
  //           position="absolute"
  //           colorScheme="red"
  //           size="md"
  //           icon={<FaArrowDown color="white" />}
  //         />
  //       </Card>
  //     </Box>
  //   </Box>
  // )}
};

export default observer(Match);

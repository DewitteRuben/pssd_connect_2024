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
import { toJS } from "mobx";
import { observer } from "mobx-react";

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

  if (!userData) throw new Error("User data was not found");

  const onSwipe = (direction: string, uid: string) => {
    switch (direction) {
      case "left":
        relationship.dislike(uid);
        break;
      case "right":
        relationship.like(uid);
        break;
    }
  };

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

  const swipableRefs = (relationship.relationships?.suggestions_info ?? []).map(() =>
    React.createRef()
  ) as any;

  return (
    <Box display="flex" flexDirection="column" overflowX="hidden" height="100%">
      {relationship.relationships?.suggestions_info &&
        relationship.relationships?.suggestions_info.length > 0 && (
          <>
            {relationship.relationships.suggestions_info.map((si, index) => (
              <Box key={si.uid}>
                <Swipeable
                  ref={swipableRefs[index]}
                  onSwipe={(direction) => onSwipe(direction, si.uid)}
                  preventSwipe={["up", "down"]}
                >
                  <Box position="relative">
                    <Image src={si.images[0]} />
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
                </Swipeable>
                <Box display="flex" justifyContent="center" marginTop="16px" gap="40px">
                  <IconButton
                    isRound={true}
                    variant="solid"
                    width="60px"
                    height="60px"
                    aria-label="dislike"
                    fontSize="36px"
                    onClick={() => {
                      relationship.dislike(si.uid);
                      swipableRefs[index].current.swipe("left");
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
                      relationship.like(si.uid);
                      swipableRefs[index].current.swipe("right");
                    }}
                    icon={<FaHeart color="green" />}
                  />
                </Box>
              </Box>
            ))}
          </>
        )}
      {(!relationship.relationships?.suggestions_info ||
        !relationship.relationships?.suggestions_info.length) && (
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
      )}
    </Box>
  );
};

export default observer(Match);

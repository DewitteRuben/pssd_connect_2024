import { Box, IconButton, Image, Text } from "@chakra-ui/react";
import Swipeable from "react-tinder-card";
import woman from "../../woman.jpg"; // Tell webpack this JS file uses this image
import { useStore } from "../../store/store";
import { differenceInYears } from "date-fns";
import { FaHeart, FaUndo } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const Match = () => {
  const {
    user: { user: userData },
  } = useStore();

  if (!userData) throw new Error("User data was not found");

  const onSwipe = (direction: string) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
  };

  return (
    <Box display="flex" flexDirection="column" overflowX="hidden" height="100%">
      <Swipeable
        onSwipe={onSwipe}
        onCardLeftScreen={() => onCardLeftScreen("fooBar")}
        preventSwipe={["up", "down"]}
      >
        <Box position="relative">
          <Box
            position="absolute"
            bottom="0"
            paddingX="16px"
            width="100%"
            height="50px"
            backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1));"
          >
            <Text fontWeight="bold" color="white" fontSize="24px">
              {userData.firstName},{" "}
              {differenceInYears(new Date(), new Date(userData.birthdate) as Date)}
            </Text>
            <Text fontWeight="bold" color="white" fontSize="20px">
              {userData.profile.jobTitle}
            </Text>
          </Box>
          <Image src={woman} />
        </Box>
      </Swipeable>
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

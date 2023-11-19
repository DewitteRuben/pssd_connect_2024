import { Box, Text } from "@chakra-ui/react";
import Swipeable from "react-tinder-card";
import woman from "../../woman.jpg"; // Tell webpack this JS file uses this image
import { useStore } from "../../store/store";
import { differenceInYears } from "date-fns";

const Match = () => {
  const {
    user: { user: userData },
  } = useStore();

  if (!userData) throw new Error("");

  const onSwipe = (direction: string) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      overflowX="hidden"
      height="100%"
      padding="16px"
    >
      <Swipeable
        onSwipe={onSwipe}
        onCardLeftScreen={() => onCardLeftScreen("fooBar")}
        preventSwipe={["up", "down"]}
      >
        <Box position="relative">
          <Box position="absolute" bottom="12px" left="12px">
            <Text fontWeight="bold" color="white" fontSize="20px">
              {userData.firstName},{" "}
              {differenceInYears(new Date(), new Date(userData.birthdate) as Date)}
            </Text>
            <Text fontWeight="bold" color="white" fontSize="20px">
              {userData.profile.about}
            </Text>
          </Box>
          <img src={woman} />
        </Box>
      </Swipeable>
    </Box>
  );
};

export default Match;

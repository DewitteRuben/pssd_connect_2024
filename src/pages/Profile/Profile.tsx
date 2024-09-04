import { Box, IconButton, Text } from "@chakra-ui/react";
import CircularImage from "../../components/CircularImage";
import { useStore } from "../../store/store";
import { observer } from "mobx-react";
import IconButtonWithText from "../../components/IconButtonWithText";
import { AiOutlineEdit } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { differenceInYears } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FaEye, FaRegHeart } from "react-icons/fa";

const Profile = () => {
  const {
    user: { user: userData },
  } = useStore();
  const navigate = useNavigate();

  if (!userData) {
    throw new Error("Invalid state! User does not exist");
  }

  const firstImage = userData.images[0];
  const age = differenceInYears(new Date(), new Date(userData.birthdate));

  return (
    <Box display="flex" flexDirection="column" height="100%" padding="16px">
      <Box
        marginTop="50px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box position="relative">
          <CircularImage src={firstImage} />
          <IconButton
            position="absolute"
            top="0"
            variant="solid"
            right="0"
            onClick={() => navigate("/profile/preview")}
            colorScheme="blue"
            isRound
            aria-label="Preview profile"
            icon={<FaEye />}
          />
        </Box>
        <Text fontSize="2xl" marginTop="8px" fontWeight="bold">
          {userData?.firstName}, {age}
        </Text>
      </Box>
      <Box display="flex" justifyContent="space-around" marginTop="50px">
        <IconButtonWithText
          onClick={() => navigate("/profile/settings")}
          text="Settings"
          icon={<FiSettings />}
        />
        <IconButtonWithText
          onClick={() => navigate("/profile/pssd")}
          text="PSSD"
          icon={<FaRegHeart />}
        />
        <IconButtonWithText
          text="Edit Profile"
          onClick={() => navigate("/profile/info")}
          icon={<AiOutlineEdit />}
        />
      </Box>
    </Box>
  );
};

export default observer(Profile);

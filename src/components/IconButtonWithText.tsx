import { IconButton, Text, Box } from "@chakra-ui/react";

type IconButtonWithText = {
  text: string;
  icon: React.ReactElement;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const IconButtonWithText: React.FC<IconButtonWithText> = ({ text, icon, onClick }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <IconButton
        onClick={onClick}
        isRound={true}
        width="52px"
        height="52px"
        variant="solid"
        aria-label={text}
        fontSize="24px"
        icon={icon}
      />
      <Text>{text}</Text>
    </Box>
  );
};

export default IconButtonWithText;

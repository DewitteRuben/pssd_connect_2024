import { Box, Button } from "@chakra-ui/react";
import { useStore } from "../../store/store";

const Home = () => {
  const { auth } = useStore();
  return (
    <Box>
      <p>this is protected</p>
      <Button onClick={auth.logout}>Logout</Button>
    </Box>
  );
};

export default Home;

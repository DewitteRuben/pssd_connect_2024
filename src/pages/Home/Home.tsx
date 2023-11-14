import {
  Box,
  Button,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useStore } from "../../store/store";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFire, AiOutlineHeart } from "react-icons/ai";
import { TbMessageCircle2 } from "react-icons/tb";
import styled from "styled-components";
import Profile from "../Profile/Profile";
import { Outlet, Route, Routes } from "react-router-dom";
import Settings from "../Settings/Settings";

const TabIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const FullTabelPanel = styled(TabPanel)`
  padding: 0;
  height: 100%;
`;

const Home = () => {
  const { auth } = useStore();
  return (
    <Tabs isFitted display="flex" flexDirection="column" height="100%">
      <TabPanels display="flex" overflow="scroll" flexDirection="column" flexGrow="1">
        <FullTabelPanel>
          <Routes>
            <Route path="profile" element={<Profile />}></Route>
            <Route path="profile/settings" element={<Settings />}></Route>
          </Routes>
        </FullTabelPanel>
        <FullTabelPanel>
          <p>Feed</p>
        </FullTabelPanel>
        <FullTabelPanel>
          <p>Natches</p>
        </FullTabelPanel>
        <FullTabelPanel>
          <p>Messages</p>
        </FullTabelPanel>
      </TabPanels>
      <TabList>
        <Tab>
          <TabIcon as={AiOutlineUser} />
        </Tab>
        <Tab>
          <TabIcon as={AiOutlineFire} />
        </Tab>
        <Tab>
          <TabIcon as={TbMessageCircle2} />
        </Tab>
      </TabList>
    </Tabs>
  );
};

export default Home;

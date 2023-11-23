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
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFire } from "react-icons/ai";
import { TbMessageCircle2 } from "react-icons/tb";
import styled from "styled-components";
import Profile from "../Profile/Profile";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Settings from "../Settings/Settings";
import Match from "../Match/Match";
import React from "react";
import _ from "lodash";
import Info from "../Info/Info";

const TabIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const FullTabelPanel = styled(TabPanel)`
  padding: 0;
  height: 100%;
`;

const indexPathMap: Record<string, number> = {
  profile: 0,
  "/": 1,
  messages: 2,
};

const Home = () => {
  const location = useLocation();
  const [tabIndex, setTabIndex] = React.useState(0);
  const navigation = useNavigate();

  React.useEffect(() => {
    const path = location.pathname.slice(1) ?? "/";
    if (path === "") {
      return setTabIndex(1);
    }

    for (const pathEntry in indexPathMap) {
      const index = indexPathMap[pathEntry];
      if (path.includes(pathEntry)) {
        setTabIndex(index);
        return;
      }
    }
  }, [location.pathname]);

  const handleTabsChange = (index: number) => {
    const path = _.findKey(indexPathMap, (o) => o === index);
    if (path) {
      setTabIndex(index);
      navigation(path);
    }
  };

  return (
    <Tabs
      isFitted
      index={tabIndex}
      onChange={handleTabsChange}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <TabPanels display="flex" overflow="scroll" flexDirection="column" flexGrow="1">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="profile/settings" element={<Settings />} />
          <Route path="profile/info" element={<Info />} />
          <Route path="/" element={<Match />} />

          <Route path="messages" element={<p>Messages</p>} />
        </Routes>
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

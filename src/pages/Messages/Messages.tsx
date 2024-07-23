import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
  Streami18n,
  DefaultStreamChatGenerics,
  ChannelPreviewUIComponentProps,
  ChannelPreviewMessenger,
} from "stream-chat-react";
import { UserResponse } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import { useStore } from "../../store/store";
import Header from "../../components/Header";
import React from "react";
import MessageHeader from "../../components/MessageHeader";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  StackDivider,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { MdFlag } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import UnmatchDialogButton from "../../components/UnmatchDialog";

const channelListOverrides = {
  "You have no channels currently": "You currently have no ongoing conversations",
};

const apiKey = "gcdbeuybxb5j";
const i18nInstance = new Streami18n({
  language: "en",
  translationsForLanguage: {
    ...channelListOverrides,
  },
});

const Messages = () => {
  const { user: userStore } = useStore();
  const [channelSelected, setChannelSelected] = React.useState(false);
  const [selectedUser, setSelectedUser] =
    React.useState<UserResponse<DefaultStreamChatGenerics>>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!userStore.user?.uid) return <div>Loading...</div>;

  const userId = userStore.user?.uid;
  const filters = { members: { $in: [userId] }, type: "messaging" };
  const options = { presence: true, state: true };
  // const sort = { last_message_at: -1 };

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userStore.user.chatToken,
    userData: { id: userId },
  });

  // Navigates back to ChannelList screen when state is reset
  React.useEffect(() => {
    if (client) {
      const hasActiveChannels = Object.keys(client?.activeChannels).length > 0;
      if (!hasActiveChannels && channelSelected) {
        setChannelSelected(false);
      }
    }
  }, [client]);

  if (!client) return <div>Loading...</div>;

  const onUnmatchClick = () => {};

  const CustomChannelPreviewUI: React.ComponentType<
    ChannelPreviewUIComponentProps<DefaultStreamChatGenerics>
  > = ({ setActiveChannel: previewSetActiveChannel, ...props }) => {
    return (
      <ChannelPreviewMessenger
        {...props}
        setActiveChannel={(channel, watchers, event) => {
          const members = channel?.state.members;
          if (members) {
            for (const memberId in members) {
              if (memberId !== userId) {
                const member = members[memberId];
                setSelectedUser(member.user);
              }
            }
          }

          if (previewSetActiveChannel) {
            previewSetActiveChannel(channel, watchers, event);
          }

          setChannelSelected(!!channel);
        }}
      />
    );
  };

  return (
    <>
      {channelSelected && selectedUser?.name && (
        <MessageHeader
          onBack={() => setChannelSelected(false)}
          onSafetyClick={() => onOpen()}
          name={selectedUser?.name}
        />
      )}
      {!channelSelected && <Header title="Messages" />}
      <Chat client={client} i18nInstance={i18nInstance}>
        {!channelSelected && (
          <ChannelList
            filters={filters}
            setActiveChannelOnMount={false}
            options={options}
            Preview={CustomChannelPreviewUI}
          />
        )}
        {channelSelected && (
          <Channel>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        )}
      </Chat>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Text fontWeight="bold" fontSize="2xl">
              Safety
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={4}
              marginBottom="16px"
              align="stretch"
            >
              <Button leftIcon={<MdFlag size="24px" color="red" />} variant="outline">
                Report {selectedUser?.name}
              </Button>
              <UnmatchDialogButton onConfirm={onUnmatchClick}>
                Unmatch from {selectedUser?.name}
              </UnmatchDialogButton>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Messages;

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
import { ChannelFilters, Channel as ChannelType, UserResponse } from "stream-chat";
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
} from "@chakra-ui/react";
import UnmatchDialogButton from "../../components/UnmatchDialog";

const channelListOverrides = {
  "You have no channels currently": "You currently have no ongoing conversations",
};

// TODO: figure out if this is a problem
const apiKey = import.meta.env.VITE_GETSTREAM_CLIENT_KEY;
const i18nInstance = new Streami18n({
  language: "en",
  translationsForLanguage: {
    ...channelListOverrides,
  },
});

const channelListOptions = { presence: true, state: true };

const Messages = () => {
  const { user: userStore, relationship } = useStore();
  const [channelSelected, setChannelSelected] = React.useState(false);
  const [currentChannel, setCurrentChannel] =
    React.useState<ChannelType<DefaultStreamChatGenerics>>();
  const [selectedUser, setSelectedUser] =
    React.useState<UserResponse<DefaultStreamChatGenerics>>();
  const { isOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

  const userId = userStore.user?.uid ?? "";
  const filters: ChannelFilters<DefaultStreamChatGenerics> = {
    members: { $in: [userId] },
    type: "messaging",
  };

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userStore.user?.chatToken,
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
  }, [channelSelected, client]);

  React.useEffect(() => {
    const unsubscribeChannelDeleted = currentChannel?.on("channel.deleted", () => {
      setChannelSelected(false);
    });

    return () => {
      unsubscribeChannelDeleted?.unsubscribe();
    };
  }, [currentChannel]);

  if (!client) return null;

  const onUnmatchClick = async () => {
    if (selectedUser) {
      await relationship.unmatch(selectedUser.id);
    }

    setChannelSelected(false);
    onDrawerClose();
  };

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

          setCurrentChannel(channel);
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
          onSafetyClick={() => onDrawerOpen()}
          name={selectedUser?.name}
        />
      )}
      {!channelSelected && <Header title="Messages" margin={false} />}
      <Chat client={client} i18nInstance={i18nInstance}>
        {!channelSelected && (
          <ChannelList
            filters={filters}
            setActiveChannelOnMount={false}
            options={channelListOptions}
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
      <Drawer placement="bottom" onClose={onDrawerClose} isOpen={isOpen}>
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
              {/* <Button leftIcon={<MdFlag size="24px" color="red" />} variant="outline">
                Report {selectedUser?.name}
              </Button> */}
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

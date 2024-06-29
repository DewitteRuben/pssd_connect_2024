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
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useStore } from "../../store/store";

const apiKey = "gcdbeuybxb5j";

const Messages = () => {
  const { user: userStore } = useStore();

  if (!userStore.user?.uid) return <div>Loading...</div>;

  const userId = userStore.user?.uid
  const filters = { members: { $in: [userId] }, type: "messaging" };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 };

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userStore.user.chatToken,
    userData: { id: userId },
  });

  if (!client) return <div>Loading...</div>;

  return (
    <Chat client={client}>
      <ChannelList filters={filters} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default Messages;

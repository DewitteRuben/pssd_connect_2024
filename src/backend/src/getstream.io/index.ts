import { StreamChat } from "stream-chat";
import { getEnvironmentVariables } from "../utils";

const { STREAM_API_KEY, STREAM_API_SECRET } = getEnvironmentVariables([
  "STREAM_API_KEY",
  "STREAM_API_SECRET",
]);

export const StreamChatClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

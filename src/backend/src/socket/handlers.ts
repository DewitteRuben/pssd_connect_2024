import { Socket } from "socket.io";
import { SocketUserStore, successResponse } from "../routes/helpers";
import { suggestionManager } from "..";
import { SuggestionWorker } from "../database/user/suggestion_worker";

const socketUserStore = new SocketUserStore();

export const onConnection = (socket: Socket) => {
  socketUserStore.add(socket.id, socket.data.authorizedUid);

  socket.on("suggestion", onSuggestionRequest(socket));
  socket.on("disconnect", onDisconnect(socket));
};

export const onSuggestionRequest = (socket: Socket) => async () => {
  const uid = socketUserStore.getUserID(socket.id);

  if (!uid) throw new Error("uid not found in socket user store");

  const result = await new SuggestionWorker(uid).update();
  const resultJSON = JSON.stringify(successResponse(result[0]));
  socket.emit("suggestion", resultJSON);

  suggestionManager.add(uid, async (suggestions) => {
    const suggestionsJSON = JSON.stringify(successResponse(suggestions[0]));
    socket.emit("suggestion", suggestionsJSON);
  });
};

export const onDisconnect = (socket: Socket) => () => {
  const uid = socketUserStore.getUserID(socket.id);
  if (uid) {
    suggestionManager.remove(uid);
  }

  socketUserStore.remove(socket.id);
};

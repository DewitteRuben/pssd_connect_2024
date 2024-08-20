import express from "express";
import cors from "cors";
import compression from "compression";
import userRoute from "./routes/user_route.js";
import relationshipRoute from "./routes/relationship_route.js";
import { ExpressError } from "./errors.js";
import { MongoDB } from "./database/mongo.js";
import {
  firebaseAuthMiddleware,
  firebaseAuthMiddlewareSocketIO,
} from "./middleware/firebaseAuth.js";
import http from "http";
import { Server } from "socket.io";
import { SuggestionManager } from "./database/user/suggestion_worker.js";
import { onConnection } from "./socket/handlers.js";

export const suggestionManager = new SuggestionManager();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173"],
  },
});

await MongoDB.connect();

app.use(cors());
app.use(compression());
app.use(express.json());

app.use("/user", firebaseAuthMiddleware, userRoute);
app.use("/relationship", firebaseAuthMiddleware, relationshipRoute);
app.get("/health", (_, res) => res.send("ok"));
app.use(
  (
    err: ExpressError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("An error occurred:", err.payload);

    return res.status(err.code).json(err.payload);
  }
);

io.use(firebaseAuthMiddlewareSocketIO);
io.on("connection", onConnection);

const port = 3000;
server.listen(port, async () => {
  console.log("Server listening on port", port);
});

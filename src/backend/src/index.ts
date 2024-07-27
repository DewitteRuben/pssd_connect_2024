import express from "express";
import cors from "cors";
import compression from "compression";
import userRoute from "./routes/user_route.js";
import relationshipRoute from "./routes/relationship_route.js";
import { ExpressError } from "./errors.js";
import { MongoDB } from "./database/mongo.js";
import { firebaseAuthMiddleware } from "./middleware/firebaseAuth.js";
import GeolocationAPI from "./geolocation.js";

const app = express();
await MongoDB.connect();

app.use(cors());
app.use(compression());
app.use(express.json());

app.post("/location/lookup", async (req, res, next) => {
  const { lattitude, longitude } = req.body as { lattitude: number; longitude: number };

  if (!lattitude || !longitude) {
    return res.status(500).json({ error: "missing parameters" });
  }

  try {
    const locationData = await GeolocationAPI.reverseLookup(lattitude, longitude);
    res.status(200).json(locationData);
  } catch (error: any) {
    next(
      new ExpressError({
        code: 500,
        message: "failed to lookup location data",
      })
    );
  }
});

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

const port = 3000;
app.listen(port, async () => {
  console.log("Server listening on port", port);
});

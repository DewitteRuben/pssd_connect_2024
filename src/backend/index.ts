import express from "express";
import { PositionStackAPI } from "./geolocation";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/location/lookup", async (req, res) => {
  const { lattitude, longitude } = req.body as { lattitude: number; longitude: number };

  if (!lattitude || !longitude) {
    return res.status(500).json({ error: "missing parameters" });
  }

  try {
    const locationData = await PositionStackAPI.reverseLookup(lattitude, longitude);
    res.status(200).json(locationData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (_, res) => res.send("ok"));

const port = 3000;
app.listen(port, () => {
  console.log("Server listening on port", port);
});

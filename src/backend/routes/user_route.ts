import express from "express";
import { UserModel } from "../database/user/user";
const router = express.Router();

router.post("/", async (req, res) => {
  const { userid } = req.body;

  const existingUser = await UserModel.findOne({ userid: userid }).exec();
});

export default router;

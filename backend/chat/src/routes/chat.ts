import express from "express";
import { CreateNewChat, getAllChats } from "../controllers/chat.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/chat/new", isAuth, CreateNewChat);
router.get("/chat/all", isAuth, getAllChats);

export default router;

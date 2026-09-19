import { Router } from "express";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../controllers/chat.controller.js";
import authUser from "../middleware/auth.middleware.js";

const chatRouter = Router();

chatRouter.get("/", authUser, getChats);
chatRouter.post("/message", authUser, sendMessage);
chatRouter.get("/:chatId/messages", authUser, getMessages);
chatRouter.delete("/delete/:chatId", authUser, deleteChat);

export default chatRouter;

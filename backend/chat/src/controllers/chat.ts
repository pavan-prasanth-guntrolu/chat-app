import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";

export const CreateNewChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userID = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({
        message: "Other user ID is required",
      });
      return;
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userID, otherUserId], $size: 2 },
    });

    if (existingChat) {
      res.send({
        message: "Chat already exists",
        chatId: existingChat._id,
      });
      return;
    }

    const newChat = await Chat.create({
      users: [userID, otherUserId],
    });

    res.status(201).json({
      message: "New Chat Created Successfully",
      chatId: newChat._id,
    });
  }
);

export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(400).json({ message: "User ID not found" });
    return;
  }
  const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

  const ChatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find((id) => id !== userId);

      const unseenCount = await Message.countDocuments({
        chatId: chat._id,
        sender: { $ne: userId },
        seen: false,
      });

      try {
        const { data } = await axios.get(
          `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`
        );

        return {
          user: data,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      } catch (error) {
        console.log(error);
        return {
          user: {
            _id: otherUserId,
            name: "Unknown User",
          },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      }
    })
  );
  res.json({
    chats: ChatWithUserData,
  });
});

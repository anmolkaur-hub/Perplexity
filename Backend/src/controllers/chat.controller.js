import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";
import {
  generateChatTitle,
  generateResponse,
} from "../services/ai.service.js";

export async function sendMessage(req, res) {
  try {
    const { message, chatId } = req.body;

    console.log("Incoming message:", message);
    console.log("Incoming chatId:", chatId);

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    let chat;

    // Create a new chat if this is the first message
    if (!chatId) {
      let title = await generateChatTitle(message);

      chat = await chatModel.create({
        userId: req.user.id,
        title: title || "New Conversation",
      });
    } else {
      chat = await chatModel.findOne({
        _id: chatId,
        userId: req.user.id,
      });

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }
    }

    // Save user's message
    await messageModel.create({
      chat: chat._id,
      content: message,
      role: "user",
    });

    // Get previous messages for context
    const previousMessages = await messageModel
      .find({ chat: chat._id })
      .sort({ createdAt: 1 });

    const result = await generateResponse(
      previousMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
    );

    // Save AI response
    const aiMessage = await messageModel.create({
      chat: chat._id,
      content: result,
      role: "ai",
    });

    res.status(200).json({
      success: true,
      title: chat.title,
      chat,
      aiMessage,
    });
  } catch (error) {
    console.error("sendMessage error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate response",
      error: error.message,
    });
  }
}

export async function getChats(req, res) {
  try {
    const chats = await chatModel
      .find({ userId: req.user.id })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      chats,
    });
  } catch (error) {
    console.error("getChats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
}

export async function getMessages(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
      _id: chatId,
      userId: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.error("getMessages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
}

export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      userId: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    await messageModel.deleteMany({
      chat: chatId,
    });

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("deleteChat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
    });
  }
}
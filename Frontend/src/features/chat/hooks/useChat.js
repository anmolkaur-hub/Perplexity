import { useDispatch, useSelector } from "react-redux";

import {
  addNewMessage,
  clearError,
  createNewChat,
  removeChat,
  resetChats,
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  setMessages,
} from "../chat.slice.js";

import {
  deleteChat,
  getChats,
  getMessages,
  sendMessage,
} from "../service/chat.api.js";

import { initializeSocketConnection } from "../service/chat.socket.js";

export function useChat() {
  const dispatch = useDispatch();

  const chats = useSelector((state) => state.chat.chats);

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));

      const data = await sendMessage({
        message,
        chatId,
      });

      console.log("Chat response:", data);

      const chat = data.chat;

      if (!chat) {
        throw new Error("Chat was not returned by server");
      }

      const activeChatId = chatId || chat._id;

      // Create chat in Redux if it is a new chat
      if (!chats[activeChatId]) {
        dispatch(
          createNewChat({
            chatId: activeChatId,
            title: chat.title,
          })
        );
      }

      // Add user's message
      if (data.userMessage) {
        dispatch(
          addNewMessage({
            chatId: activeChatId,
            content: data.userMessage.content,
            role: "user",
          })
        );
      } else {
        // Fallback in case backend doesn't return userMessage
        dispatch(
          addNewMessage({
            chatId: activeChatId,
            content: message,
            role: "user",
          })
        );
      }

      // Add AI response
      if (data.aiMessage) {
        dispatch(
          addNewMessage({
            chatId: activeChatId,
            content: data.aiMessage.content,
            role: "ai",
            sources: data.aiMessage.sources || [],
          })
        );
      }

      dispatch(setCurrentChatId(activeChatId));

      return {
        success: true,
        chat,
      };
    } catch (error) {
      console.error("handleSendMessage error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message";

      dispatch(setError(errorMessage));

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const data = await getChats();

      const formatted = data.chats.reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: chat.updatedAt,
        };

        return acc;
      }, {});

      dispatch(setChats(formatted));
    } catch (error) {
      console.error("handleGetChats error:", error);

      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to fetch chats"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId) {
    try {
      dispatch(clearError());
      dispatch(setCurrentChatId(chatId));

      if (chats[chatId]?.messages?.length > 0) {
        return;
      }

      dispatch(setLoading(true));

      const data = await getMessages(chatId);

      const messages = data.messages.map((msg) => ({
        id: msg._id,
        content: msg.content,
        role: msg.role,
        sources: msg.sources || [],
      }));

      dispatch(
        setMessages({
          chatId,
          messages,
        })
      );
    } catch (error) {
      console.error("handleOpenChat error:", error);

      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to open chat"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleDeleteChat(chatId) {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      await deleteChat(chatId);

      dispatch(removeChat(chatId));
    } catch (error) {
      console.error("handleDeleteChat error:", error);

      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to delete chat"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  function resetChatState() {
    dispatch(resetChats());
  }

  return {
    chats,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    initializeSocketConnection,
    resetChats: resetChatState,
  };
}
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chats[chatId] = {
        id: chatId,
        title: title || "New Chat",
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role, sources = [] } = action.payload;
      if (!state.chats[chatId]) return;
      state.chats[chatId].messages.push({
        id: `${Date.now()}-${Math.random()}`,
        content,
        role,
        sources,
      });
      state.chats[chatId].lastUpdated = new Date().toISOString();
    },
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!state.chats[chatId]) return;
      state.chats[chatId].messages = messages;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    removeChat: (state, action) => {
      delete state.chats[action.payload];
      if (state.currentChatId === action.payload) {
        state.currentChatId = null;
      }
    },
    resetChats: (state) => {
      state.chats = {};
      state.currentChatId = null;
    },
  },
});

export const {
  createNewChat,
  addNewMessage,
  setMessages,
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  clearError,
  removeChat,
  resetChats,
} = chatSlice.actions;

export default chatSlice.reducer;

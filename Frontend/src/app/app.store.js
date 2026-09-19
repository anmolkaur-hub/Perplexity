import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice.js";
import chatReducer from "../features/chat/chat.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;

import { io } from "socket.io-client";

let socket;

export function initializeSocketConnection() {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });

  return socket;
}

export function closeSocketConnection() {
  socket?.disconnect();
  socket = null;
}

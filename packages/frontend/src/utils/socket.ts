import io from "socket.io-client";

export const socketio = io("http://localhost:8000", {
  upgrade: false,
  autoConnect: false,
  transports: ["websocket"],
});

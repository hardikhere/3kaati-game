import { createContext, useContext, useMemo } from "react";
import io, { Socket } from "socket.io-client";
const SocketContext = createContext<Socket<any, any> | null>(null);
export const useSocket = () => useContext(SocketContext);
export default function SocketProvider({ children }) {
  const socketio = useMemo(
    () =>
      io("ws://localhost:8000", {
        upgrade: false,
        autoConnect: false,
      }),
    []
  );

  return (
    <SocketContext.Provider value={socketio}>{children}</SocketContext.Provider>
  );
}

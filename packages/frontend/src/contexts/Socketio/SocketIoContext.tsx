import { createContext, useContext, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { getLink } from "utils/common";
const SocketContext = createContext<Socket<any, any> | null>(null);
export const useSocket = () => useContext(SocketContext);
export default function SocketProvider({ children }) {
  const socketio = useMemo(
    () =>
      io(getLink(), {
        upgrade: false,
        autoConnect: false,
        transports: ["websocket"],
      }),
    []
  );

  return (
    <SocketContext.Provider value={socketio}>{children}</SocketContext.Provider>
  );
}

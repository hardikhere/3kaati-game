import io from "socket.io-client";
import { getLink } from "utils/common";
export const socketio = io(getLink(), {
    upgrade: false,
    autoConnect: false,
    transports: ["websocket"],
});

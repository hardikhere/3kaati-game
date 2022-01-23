import { useSocket } from "contexts/Socketio/SocketIoContext";
import React, { useEffect } from "react";

function WaitingPage() {
  const socketio = useSocket();
  useEffect(() => {
    socketio?.on("JOINED_ROOM", (room) => {
      console.log("your friend joined the room ", room);
    });
    console.log(
      "🚀 ~ file: WaitingPage.tsx ~ line 10 ~ socketio?.on ~ socketio",
      socketio
    );
  }, []);
  return (
    <div>
      <h1>waiting for your friend to join room</h1>
      <a href={`http://localhost:3000/join/${socketio?.id}`}>link is here</a>
    </div>
  );
}

export default WaitingPage;

import { useSocket } from "contexts/Socketio/SocketIoContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JoinPage() {
  const params = useParams();
  const socketio = useSocket();

  const [username, setUserName] = useState("");
  const handleChange = (e) => {
    setUserName(e.target.value);
  };

  function joinRoom() {
    socketio?.emit("JOIN_ROOM", {
      username,
      roomId: params.roomId,
    });
  }

  useEffect(() => {
    socketio?.open();
  }, []);

  return (
    <div>
      <div>
        <label htmlFor="username">Your unique User name</label>
        <input
          value={username}
          type="text"
          id="username"
          onChange={handleChange}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

export default JoinPage;

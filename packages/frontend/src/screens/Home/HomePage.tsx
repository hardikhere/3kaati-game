import { useSocket } from "contexts/Socketio/SocketIoContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const socketio = useSocket();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleRoomNameChange = (e) => {
    setRoomId(e.target.value);
  };
  const createRoom = () => {
    socketio?.open();
    socketio?.emit("CREATE_ROOM", { userName });
    navigate("/waiting");
  };

  const joinRoom = () => {
    socketio?.emit("JOIN_ROOM");
  };
  return (
    <div>
      <form>
        <h3>Create room</h3>
        <label htmlFor="username">Your nick name</label>
        <input
          type="text"
          id="username"
          onChange={handleNameChange}
          value={userName}
        />
        <button onClick={createRoom}>Submit</button>
      </form>

      <form>
        <h3>Join room</h3>
        <label htmlFor="username">Your nick name</label>
        <input
          type="text"
          id="username"
          onChange={handleNameChange}
          value={userName}
        />
        <label htmlFor="roomid"></label>
        <input
          type="text"
          id="roomid"
          onChange={handleRoomNameChange}
          value={roomId}
        />
        <button onClick={joinRoom}>Submit</button>
      </form>
    </div>
  );
}

export default HomePage;

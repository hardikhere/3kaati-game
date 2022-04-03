import { nanoid } from "@reduxjs/toolkit";
import { socketio } from "utils/socket";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPlayer } from "store/reducers/playersSlice";

function HomePage() {
  const dispatch = useDispatch();
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
    const newRoomId = nanoid(10);
    const playerId = nanoid(8);
    const playerDetails = {
      userName,
      roomId: newRoomId,
      playerId,
      color: "red",
      position: "left",
    };
    socketio?.emit("CREATE_ROOM", playerDetails);
    dispatch(setPlayer({ ...playerDetails, isMe: true }));
    navigate(`/waiting/${newRoomId}`);
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

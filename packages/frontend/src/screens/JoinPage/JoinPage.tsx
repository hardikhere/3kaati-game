import { nanoid } from "@reduxjs/toolkit";
import { useSocket } from "contexts/Socketio/SocketIoContext";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setPlayer } from "store/reducers/playersSlice";

function JoinPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const socketio = useSocket();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const handleChange = (e) => {
    setUserName(e.target.value);
  };
  const players = useSelector((state: any) => state.players);
  const playerId = useRef(nanoid(8));

  function joinRoom() {
    socketio?.emit("JOIN_ROOM", {
      username,
      roomId: params.roomId,
      playerId: playerId.current,
      color: "blue",
      position: "right",
    });
  }

  useEffect(() => {
    if (Object.keys(players).length === 2) navigate("/game");
  }, [players]);

  useEffect(() => {
    socketio?.open();

    socketio?.on("message", (data) => {
      console.log(data);
      if (data.type !== "present_users") return;
      data?.data?.forEach((player) => {
        // TODO: remove any later
        const dataToSave: any = { ...player };
        if (player.playerId === playerId.current) {
          dataToSave.isMe = true;
        } else dataToSave.isMe = false;
        dispatch(setPlayer(dataToSave));
      });
    });
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

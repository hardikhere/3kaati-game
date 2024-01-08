import { nanoid } from "@reduxjs/toolkit";
import { socketio } from "utils/socket";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setPlayer } from "store/reducers/playersSlice";
import {
  JoinButton,
  JoinContainer,
  JoinForm,
  JoinInput,
} from "screens/JoinPage/joinStyles";

function JoinPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const handleChange = (e) => {
    setUserName(e.target.value);
  };
  const players = useSelector((state: any) => state.players);
  const playerId = useRef(nanoid(8));

  function joinRoom() {
    const userDetails = {
      userName,
      roomId: params.roomId,
      playerId: playerId.current,
      color: "blue",
      position: "right",
      isMe: true,
    };
    socketio?.emit("JOIN_ROOM", userDetails);
    dispatch(setPlayer(userDetails));
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
        const dataToSave: any = { ...player, isMe: false };
        dispatch(setPlayer(dataToSave));
      });
    });
  }, []);

  return (
    <JoinContainer>
      <JoinForm>
        <label htmlFor="userName">Your unique User name</label>
        <JoinInput
          as={"input"}
          value={userName}
          type="text"
          id="userName"
          onChange={handleChange}
        />
        <JoinButton as="button" onClick={joinRoom}>
          Join Room
        </JoinButton>
      </JoinForm>
    </JoinContainer>
  );
}

export default JoinPage;

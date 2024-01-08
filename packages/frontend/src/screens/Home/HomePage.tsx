import { nanoid } from "@reduxjs/toolkit";
import { socketio } from "utils/socket";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPlayer } from "store/reducers/playersSlice";
import {
  HomeButton,
  HomeContainer,
  HomeForm,
  HomeInput,
} from "screens/Home/homeStyle";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const handleNameChange = (e) => {
    setUserName(e.target.value);
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

  return (
    <HomeContainer>
      <HomeForm>
        <h3>Create room</h3>
        <label htmlFor="userName">Your nick name</label>
        <HomeInput
          as={"input"}
          type="text"
          id="userName"
          onChange={handleNameChange}
          value={userName}
        />
        <HomeButton as="button" onClick={createRoom}>
          Submit
        </HomeButton>
      </HomeForm>
    </HomeContainer>
  );
}

export default HomePage;

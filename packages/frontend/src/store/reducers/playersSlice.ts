import { createSlice } from "@reduxjs/toolkit";

export const playerSlice = createSlice({
  name: "players",
  initialState: {} as playersState,
  reducers: {
    setPlayer: (state, action) => {
      state[action.payload.playerId] = action.payload;
    },
  },
});

export const { setPlayer } = playerSlice.actions;
interface IUser {
  userName: string;
  roomId: string;
  playerId: string;
  isMe: boolean;
  color: "red" | "blue";
  position: "left" | "right";
}

type playersState = Record<string, IUser>;

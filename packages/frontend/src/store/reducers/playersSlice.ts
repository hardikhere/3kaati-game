import { createSlice } from "@reduxjs/toolkit";

export const playerSlice = createSlice({
  name: "players",
  initialState: {} as playersState,
  reducers: {
    setPlayer: (state, action) => {
      state[action.payload.playerId] = { ...action.payload, hasChance: false };
    },
    changeTurn: (state, action) => {
      Object.values(state).forEach(player => {
        if (player.playerId === action.payload) state[player.playerId].hasChance = true;
        else state[player.playerId].hasChance = false
      })
    }
  },
});

export const { setPlayer, changeTurn } = playerSlice.actions;
interface IUser {
  userName: string;
  roomId: string;
  playerId: string;
  isMe: boolean;
  color: "red" | "blue";
  position: "left" | "right";
  hasChance: boolean;
}

type playersState = Record<string, IUser>;

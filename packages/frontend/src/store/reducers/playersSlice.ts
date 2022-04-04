import { createSlice } from "@reduxjs/toolkit";

export const playerSlice = createSlice({
  name: "players",
  initialState: {} as playersState,
  reducers: {
    setPlayer: (state, action) => {
      state[action.payload.playerId] = { ...action.payload, hasChance: false, hasWon: false };
    },
    setWinner: (state, action) => {
      state[action.payload].hasWon = true;
    },
    changeTurn: (state, action) => {
      Object.values(state).forEach(player => {
        if (player.playerId === action.payload) state[player.playerId].hasChance = true;
        else state[player.playerId].hasChance = false
      })
    }
  },
});

export const { setPlayer, changeTurn, setWinner } = playerSlice.actions;
export interface IUser {
  userName: string;
  roomId: string;
  playerId: string;
  isMe: boolean;
  color: "red" | "blue";
  position: "left" | "right";
  hasChance: boolean;
  hasWon: boolean;
}

type playersState = Record<string, IUser>;

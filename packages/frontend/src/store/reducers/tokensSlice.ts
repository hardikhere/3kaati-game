import { createSlice } from "@reduxjs/toolkit";

export const tokensReducer = createSlice({
  name: "tokens",
  initialState: {} as tokenReduxState,
  reducers: {
    initToken: (state: tokenReduxState, action) => {
      const { playerId, tokenId } = action.payload;
      if (!state[playerId]) state[playerId] = { [tokenId]: action.payload };
      else state[playerId][tokenId] = action.payload;
    },

    setToken: (state, action) => {
      const { tokenId, playerId } = action.payload;
      if (!state[playerId] || !state[playerId][tokenId])
        throw new Error("please initialize state before placing it");
      state[playerId][tokenId] = action.payload;
    },
  },
});

export const { initToken, setToken } = tokensReducer.actions;

interface ITokenState {
  row: number | null;
  col: number | null;
  x: number;
  y: number;
  tokenId: string;
}
type tokenReduxState = Record<string, Record<string, ITokenState>>;

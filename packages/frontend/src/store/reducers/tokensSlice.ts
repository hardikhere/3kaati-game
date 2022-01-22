import { createSlice } from "@reduxjs/toolkit";

export const tokensReducer = createSlice({
  name: "tokens",
  initialState: {} as tokenReduxState,
  reducers: {
    initToken: (state: tokenReduxState, action) => {
      const { teamId, tokenId } = action.payload;
      if (!state[teamId]) state[teamId] = { [tokenId]: action.payload };
      else state[teamId][tokenId] = action.payload;
    },

    setToken: (state, action) => {
      const { tokenId, teamId } = action.payload;
      if (!state[teamId] || !state[teamId][tokenId])
        throw new Error("please initialize state before placing it");
      state[teamId][tokenId] = action.payload;
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

import { configureStore } from "@reduxjs/toolkit";
import { playerSlice } from "./reducers/playersSlice";
import { tokensReducer } from "./reducers/tokensSlice";

const store = configureStore({
  reducer: {
    tokens: tokensReducer.reducer,
    players: playerSlice.reducer,
  },
});
export default store;

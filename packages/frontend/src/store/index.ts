import { configureStore } from "@reduxjs/toolkit";
import { tokensReducer } from "./reducers/tokensSlice";

const store = configureStore({
  reducer: {
    tokens: tokensReducer.reducer,
  },
});
export default store;

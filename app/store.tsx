import { configureStore } from "@reduxjs/toolkit";
import { animalsSlice } from "./animalsSlice";

export const store = configureStore({
  reducer: animalsSlice.reducer
});

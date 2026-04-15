import { configureStore } from "@reduxjs/toolkit";
import quranReducer from "../features/quran/QuranSlice";

export const store = configureStore({
  reducer: {
    quran: quranReducer,
  },
});
import { SerializedError, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { receiveMessage, sendMessage } from "./messengerSlice";
import { login } from "./authSlice";

const initialState: appSliceType = {
  pending: false,
  error: null,
};

type appSliceType = {
  pending: boolean;
  error: SerializedError | null;
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addMatcher(
        isAnyOf(
          login.fulfilled,
          sendMessage.fulfilled,
          receiveMessage.fulfilled
        ),
        (state) => {
          state.pending = false;
        }
      )
      .addMatcher(
        isAnyOf(login.pending, sendMessage.pending, receiveMessage.pending),
        (state) => {
          state.pending = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(login.rejected, sendMessage.rejected, receiveMessage.rejected),
        (state, action) => {
          state.pending = false;
          state.error = action.error;
        }
      ),
});

export const appReducer = appSlice.reducer;

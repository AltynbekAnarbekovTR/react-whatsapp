import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import { getSavedAuth, saveAuth } from "../utils/localStorage";

const { idInstance, apiTokenInstance, ownerPhoneNum } = getSavedAuth();

const initialState: MessengerStateType = {
  idInstance,
  apiTokenInstance,
  ownerPhoneNum,
  pending: false,
  error: null,
};

export const login = createAsyncThunk(
  "messenger/login",
  async ({ idInstance, apiTokenInstance }: LoginType) => {
    try {
      const response = await fetch(
        `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`
      );
      const data = await response.json();
      const ownerPhoneNum = "+" + data.wid.replace(/\D/g, "");
      return { idInstance, apiTokenInstance, ownerPhoneNum };
    } catch (e) {
      alert(e);
    }
  }
);

const authSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    logout: (state) => {
      state.idInstance = null;
      state.apiTokenInstance = null;
      state.ownerPhoneNum = null;
      localStorage.removeItem("authState");
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload) {
          state.idInstance = action.payload.idInstance;
          state.apiTokenInstance = action.payload.apiTokenInstance;
          state.ownerPhoneNum = action.payload.ownerPhoneNum;
          saveAuth(idInstance, apiTokenInstance, ownerPhoneNum);
          state.error = null;
        }
      })
      .addCase(login.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error;
      }),
});

export const authActions = authSlice.actions;
export const authAsyncActions = { login };
export const authReducer = authSlice.reducer;

type MessengerStateType = {
  idInstance: string | null;
  apiTokenInstance: string | null;
  ownerPhoneNum: string | null;
  pending: boolean;
  error: SerializedError | null;
};

type LoginType = {
  idInstance: string;
  apiTokenInstance: string;
};

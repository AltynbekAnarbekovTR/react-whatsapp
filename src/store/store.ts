import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { messengerReducer } from "./messengerSlice";
import { appReducer } from "./appSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  messenger: messengerReducer,
  app: appReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;

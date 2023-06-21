import { createSelector } from "@reduxjs/toolkit";
import { RootStateType } from "./store";

const selectIdInstance = (state: RootStateType) => state.auth.idInstance;
const selectApiTokenInstance = (state: RootStateType) =>
  state.auth.apiTokenInstance;

export const selectLoggedIn = createSelector(
  [selectIdInstance, selectApiTokenInstance],
  (idInstance, apiTokenInstance) =>
    idInstance !== null && apiTokenInstance !== null
);

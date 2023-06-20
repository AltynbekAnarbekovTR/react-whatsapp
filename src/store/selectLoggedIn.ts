import { createSelector } from "@reduxjs/toolkit";
import { RootStateType } from "./store";

const selectIdInstance = (state: RootStateType) => state.idInstance;
const selectApiTokenInstance = (state: RootStateType) => state.apiTokenInstance;

export const selectLoggedIn = createSelector(
  [selectIdInstance, selectApiTokenInstance],
  (idInstance, apiTokenInstance) =>
    idInstance !== null && apiTokenInstance !== null
);

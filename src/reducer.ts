import { PopoverHeader } from "react-bootstrap";

export const initialState = {
  // user:null,
  idInstance: null,
  apiTokenInstance: null,
  phoneNums: [],
};

import React, { createContext, useContext, useReducer } from "react";

export const StateContext = createContext({});

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_NUMBER: "SET_NUMBER",
};

const reducer = (state: RootState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        idInstance: action.idInstance,
        apiTokenInstance: action.apiTokenInstance,
      };
    case actionTypes.SET_NUMBER:
      return {
        ...state,
        phoneNums: [...state.phoneNums, action.phoneNumInput],
      };
    default:
      return state;
  }
};

export default reducer;

export type RootState = typeof initialState;

import React, { createContext, useContext, useReducer } from "react";
import { RootState } from "./reducer";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

export const StateContext = createContext({});

type StateProviderProps = {
  reducer: (state: any, action: any) => any;
  initialState: RootState;
  children: ReactJSXElement;
};

export const StateProvider = ({
  reducer,
  initialState,
  children,
}: StateProviderProps) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);

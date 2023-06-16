import { useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootStateType } from "../store/store";

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;

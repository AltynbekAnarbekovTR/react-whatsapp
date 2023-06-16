import { useDispatch } from "react-redux";
import type { AppDispatchType } from "../store/store";

export const useAppDispatch = () => useDispatch<AppDispatchType>();

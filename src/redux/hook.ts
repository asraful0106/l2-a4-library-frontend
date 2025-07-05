import {useDispatch, useSelector} from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<RootState>();
export const useAppSelector = useSelector.withTypes<AppDispatch>();
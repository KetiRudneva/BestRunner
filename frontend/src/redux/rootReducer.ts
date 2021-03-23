import {combineReducers} from "redux";
import {appReducer, appReducerState} from "./appReducer";

export const rootReducer = combineReducers({
    app: appReducer
})

export interface Store {
    app: appReducerState
}

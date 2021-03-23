import {
    AppActionTypes,
    CHANGE_LOADING,
    CHANGE_WORKOUTS,
    FETCH_USER_AUTH,
    FETCH_USER_REGISTRATION,
    FETCH_WORKOUTS,
    LOGOUT
} from "./types";
import {User, Workout} from "../common/models";

export interface appReducerState {
    loading: boolean;
    user: User | null;
    workouts: Workout[];
}

const initialState: appReducerState = {loading: false, user: null, workouts: []};

export const appReducer = (state = initialState, action: AppActionTypes) => {

    switch (action.type) {
        case FETCH_USER_AUTH: {
            return {...state, user: action.payload}
        }
        case CHANGE_LOADING: {
            return {...state, loading: action.payload}
        }
        case FETCH_USER_REGISTRATION: {
            return {...state, user: action.payload}
        }
        case LOGOUT: {
            return {...state, user: null, workouts: []}
        }
        case FETCH_WORKOUTS: {
            return {...state, workouts: action.payload}
        }
        case CHANGE_WORKOUTS: {
            return {...state, workouts: action.payload}
        }
        default:
            return state
    }
}

import {CHANGE_LOADING, CHANGE_WORKOUTS, FETCH_USER_AUTH, FETCH_WORKOUTS, LOGOUT} from "./types";
import {ThunkAction} from "redux-thunk";
import {Store} from "./rootReducer";
import {Action} from "redux";
import {Workout} from "../common/models";

export const changeLoading = (payload: boolean) => {
    return {
        type: CHANGE_LOADING,
        payload
    }
}

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, Store, unknown, Action<string>>

export const _BACKEND_URL = process.env.REACT_APP_BACKEND!;

export const fetchUserAuth = (username: string, password: string): AppThunk => async (dispatch, store) => {
    fetch(_BACKEND_URL + '/auth', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(r => r.json())
        .then(r => {
            if (r.result === "ok") {
                dispatch({type: FETCH_USER_AUTH, payload: r.user[0]});
            } else if (r.result === "not registered") {
                alert('Не зарегистрирован')
            }
            dispatch(changeLoading(false))
        })
}

export const fetchUserRegistration = (username: string, password: string): AppThunk => async (dispatch, store) => {
    fetch(_BACKEND_URL + '/reg', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(r => r.json())
        .then(r => {
            if (r.result === "ok") {
                dispatch({type: FETCH_USER_AUTH, payload: r.user[0]});
            } else if (r.result === "registered") {
                alert('Этот ник уже зарегистрирован')
            }
            dispatch(changeLoading(false))
        })
}

export const logOutAction = () => {
    return {type: LOGOUT}
}

export const fetchWorkouts = (userId: string): AppThunk => async (dispatch, store) => {
    dispatch(changeLoading(true))
    fetch(_BACKEND_URL + '/getWorkouts', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: userId
        })
    })
        .then(r => r.json())
        .then(r => {
            dispatch({type: FETCH_WORKOUTS, payload: r.result});
            dispatch(changeLoading(false))
        })
}

export const changeWorkouts = (workouts: Workout[]) => {
    return {type: CHANGE_WORKOUTS, payload: workouts}
}

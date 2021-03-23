import {User, Workout} from "../common/models";

// Запрос данных

export interface FetchUserAuth {
    type: typeof FETCH_USER_AUTH;
    payload: {user: User}
}

export interface ChangeLoading {
    type: typeof CHANGE_LOADING,
    payload: boolean
}

export interface FetchUserRegistration {
    type: typeof FETCH_USER_REGISTRATION;
    payload: {user: User}
}

export interface LogOut {
    type: typeof LOGOUT
}

export interface FetchWorkouts {
    type: typeof FETCH_WORKOUTS,
    payload: {result: Workout[]}
}

export interface ChangeWorkouts {
    type: typeof CHANGE_WORKOUTS,
    payload: Workout[]
}

export const FETCH_USER_AUTH = 'APP/FETCH_USER'
export const CHANGE_LOADING = 'APP/CHANGE_LOADING'
export const FETCH_USER_REGISTRATION = 'APP/FETCH_USER_REGISTRATION'
export const LOGOUT = 'APP/LOGOUT'
export const FETCH_WORKOUTS = 'APP/FETCH_WORKOUTS'
export const CHANGE_WORKOUTS = 'APP/CHANGE_WORKOUTS'

export type AppActionTypes = FetchUserAuth | ChangeLoading | FetchUserRegistration | LogOut | FetchWorkouts| ChangeWorkouts

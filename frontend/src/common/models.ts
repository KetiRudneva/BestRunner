export interface User {
    _id: string;
    username: string;
    password: string;
}

export interface Workout {
    _id: number;
    user_id: string;
    type: "run" | "bike" | "skiing" | "walking";
    date: string;
    length: number;
    comment: string;
}

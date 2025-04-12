import { Chart } from "./Chart";

export type AuthenticationRequest = {
    username: string;
    password: string;
}

export type User = {
    id: number;
    username: string;
    favorites: Chart[];
}
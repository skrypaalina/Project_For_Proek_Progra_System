import { api } from "./client.js";

export function getMovies() {
    return api("/movies");
}
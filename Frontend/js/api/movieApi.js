import { api } from "./client.js";

export async function getMovies() {
    return await api("/api/movies"); 
}
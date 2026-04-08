import { getMovies } from "../api/movieApi.js";
import { movieCard } from "../../components/movieCard.js";

const container = document.getElementById("movies");

getMovies().then(data => {
    data.forEach(movie => {
        container.innerHTML += movieCard(movie);
    });
});

window.openMovie = (id) => {
    window.location.href = "movie.html?id=" + id;
};
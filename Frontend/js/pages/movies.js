import { getMovies } from "../api/movieApi.js";
import { movieCard } from "../../components/movieCard.js";

const container = document.getElementById("movies");

async function loadMovies() {
    try {
        const movies = await getMovies();
        
        container.innerHTML = "";

        if (!movies || movies.length === 0) {
            container.innerHTML = "<p style='color: white; text-align: center; grid-column: 1 / -1;'>Фільмів поки немає. Додайте їх у базу даних!</p>";
            return;
        }

        movies.forEach(movie => {
            container.innerHTML += movieCard(movie);
        });
    } catch (error) {
        console.error("Помилка:", error);
        container.innerHTML = "<p style='color: #e50914; text-align: center; grid-column: 1 / -1;'>Помилка завантаження фільмів з сервера.</p>";
    }
}

loadMovies();

window.openMovie = (id) => {
    window.location.href = `movie.html?id=${id}`;
};
export function movieCard(movie) {
    return `
        <div class="movie-card" onclick="openMovie(${movie.id})">
            <img src="https://via.placeholder.com/150x220">
            <p>${movie.title}</p>
        </div>
    `;
}
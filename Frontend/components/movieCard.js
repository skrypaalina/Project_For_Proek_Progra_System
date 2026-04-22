export function movieCard(movie) {
    const imageUrl = movie.poster_url ? movie.poster_url : "https://via.placeholder.com/250x350/222222/e50914?text=Постер";
    
    return `
        <div class="movie-card" onclick="openMovie(${movie.id})" style="cursor: pointer; background: #111; border-radius: 8px; overflow: hidden; transition: transform 0.2s; text-align: center; display: flex; flex-direction: column; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
            <img src="${imageUrl}" alt="${movie.title}" style="width: 100%; height: 350px; object-fit: cover;">
            <div style="padding: 15px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
                <h3 style="color: white; margin: 0; font-size: 1.1rem; line-height: 1.4;">${movie.title}</h3>
                
                <button style="margin-top: 15px; background: #e50914; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">
                    Вибрати сеанс
                </button>
            </div>
        </div>
    `;
}
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

const BASE_URL = "http://127.0.0.1:8005/api";

async function loadData() {
    const container = document.getElementById('sessions-container'); // Переконайся, що в movie.html є такий ID
    const titleEl = document.getElementById('movie-title');
    const descEl = document.getElementById('movie-description');
    const posterEl = document.getElementById('movie-poster');

    if (!movieId) {
        if (container) container.innerHTML = "<p>Фільм не знайдено (ID відсутній).</p>";
        return;
    }

    try {
        console.log("Починаю завантаження для ID:", movieId);

        const movieResponse = await fetch(`${BASE_URL}/movies/${movieId}`);
        if (!movieResponse.ok) throw new Error(`Помилка фільму: ${movieResponse.status}`);
        const movie = await movieResponse.json();
        
        titleEl.textContent = movie.title;
        descEl.textContent = movie.description;

        if (movie.poster_url) {
            posterEl.src = movie.poster_url;
            posterEl.style.display = 'block';
        } else {
            posterEl.style.display = 'none';
        }

        const sessionsResponse = await fetch(`${BASE_URL}/movies/${movieId}/sessions`);
        if (!sessionsResponse.ok) throw new Error(`Помилка сеансів: ${sessionsResponse.status}`);
        const sessions = await sessionsResponse.json();

        if (container) {
            container.innerHTML = ""; 
            
            if (sessions.length === 0) {
                container.innerHTML = "<p>На жаль, сеансів поки немає.</p>";
                return;
            }

            const now = new Date();
            let hasFutureSessions = false;

            sessions.forEach(session => {
                const sessionDate = new Date(session.start_time);

                if (sessionDate > now) {
                    hasFutureSessions = true;

                    const dateStr = sessionDate.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
                    const timeStr = sessionDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

                    const btn = document.createElement('button');
                    btn.className = 'session-btn';
                    btn.innerHTML = `${dateStr} о ${timeStr} <br> <span>${session.base_price} грн</span>`;
                    
                    btn.onclick = () => window.location.href = `booking.html?session_id=${session.id}`;
                    container.appendChild(btn);
                }
            });

            if (!hasFutureSessions) {
                container.innerHTML = "<p>На жаль, усі сеанси на цей фільм уже пройшли.</p>";
            }
        }

    } catch (error) {
        console.error("Помилка завантаження:", error);
        if (container) {
            container.innerHTML = `<p style="color: red;">Сталася помилка: ${error.message}. Перевірте, чи запущено бекенд на порту 8005.</p>`;
        }
    }
}

loadData();
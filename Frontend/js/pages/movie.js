const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Вказуємо правильну адресу бекенду
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

        // ВИПРАВЛЕНО: Додано повну адресу BASE_URL
        const movieResponse = await fetch(`${BASE_URL}/movies/${movieId}`);
        if (!movieResponse.ok) throw new Error(`Помилка фільму: ${movieResponse.status}`);
        const movie = await movieResponse.json();
        
        titleEl.textContent = movie.title;
        descEl.textContent = movie.description;

        // Вставляємо фото
        if (movie.poster_url) {
            posterEl.src = movie.poster_url;
            posterEl.style.display = 'block';
        } else {
            posterEl.style.display = 'none';
        }

        // ВИПРАВЛЕНО: Додано повну адресу BASE_URL
        const sessionsResponse = await fetch(`${BASE_URL}/movies/${movieId}/sessions`);
        if (!sessionsResponse.ok) throw new Error(`Помилка сеансів: ${sessionsResponse.status}`);
        const sessions = await sessionsResponse.json();

        if (container) {
            container.innerHTML = ""; 
            
            if (sessions.length === 0) {
                container.innerHTML = "<p>На жаль, сеансів поки немає.</p>";
                return;
            }

            sessions.forEach(session => {
                const time = new Date(session.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const btn = document.createElement('button');
                btn.className = 'session-btn';
                btn.innerHTML = `${time} <br> <span>${session.base_price} грн</span>`;
                // ТУТ ТЕЖ ПРИБИРАЄМО СЛЕШ, якщо файл лежить у корені
                btn.onclick = () => window.location.href = `booking.html?session_id=${session.id}`;
                container.appendChild(btn);
            });
        }

    } catch (error) {
        console.error("Помилка завантаження:", error);
        if (container) {
            container.innerHTML = `<p style="color: red;">Сталася помилка: ${error.message}. Перевірте, чи запущено бекенд на порту 8005.</p>`;
        }
    }
}

loadData();
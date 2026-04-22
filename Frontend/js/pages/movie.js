const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function loadData() {
    const container = document.getElementById('sessions-container');
    const titleEl = document.getElementById('movie-title');
    const descEl = document.getElementById('movie-description');
    
    // 1. Знаходимо тег для картинки, який ми додали в HTML
    const posterEl = document.getElementById('movie-poster');

    try {
        console.log("Починаю завантаження для ID:", movieId);

        const movieResponse = await fetch(`/api/movies/${movieId}`);
        if (!movieResponse.ok) throw new Error(`Помилка фільму: ${movieResponse.status}`);
        const movie = await movieResponse.json();
        
        titleEl.textContent = movie.title;
        descEl.textContent = movie.description;

        // --- НОВИЙ БЛОК: ВСТАВЛЯЄМО ФОТО ---
        // Тут ми припускаємо, що у вашій базі даних колонка з картинкою називається 'poster_url'
        if (movie.poster_url) {
            posterEl.src = movie.poster_url;
            posterEl.style.display = 'block'; // Показуємо фото
        } else {
            posterEl.style.display = 'none'; // Ховаємо рамку, якщо фото немає в базі
        }
        // ------------------------------------

        const sessionsResponse = await fetch(`/api/movies/${movieId}/sessions`);
        if (!sessionsResponse.ok) throw new Error(`Помилка сеансів: ${sessionsResponse.status}`);
        const sessions = await sessionsResponse.json();

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
            btn.onclick = () => window.location.href = `/booking.html?session_id=${session.id}`;
            container.appendChild(btn);
        });

    } catch (error) {
        console.error("Помилка завантаження:", error);
        container.innerHTML = `<p style="color: red;">Сталася помилка: ${error.message}. Перевірте консоль (F12).</p>`;
    }
}

loadData();
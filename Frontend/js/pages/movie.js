// Отримуємо ID з URL (якщо він є)
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Визначаємо адресу запиту. 
// Якщо є ID — запитуємо сеанси конкретного фільму, якщо немає — всі фільми.
const apiUrl = id 
    ? `http://127.0.0.1:8000/api/sessions/${id}` 
    : `http://127.0.0.1:8000/api/movies`;

const displayElement = document.getElementById("movies") || document.getElementById("sessions");

if (displayElement) {
    fetch(apiUrl)
    .then(res => {
        if (!res.ok) throw new Error("Помилка завантаження даних");
        return res.json();
    })
    .then(data => {
        displayElement.innerHTML = ""; // Очищуємо текст "Завантаження..."

        if (data.length === 0) {
            displayElement.innerHTML = "<p>На жаль, нічого не знайдено.</p>";
            return;
        }

        data.forEach(item => {
            // Якщо це фільм (має title), малюємо картку фільму
            if (item.title) {
                displayElement.innerHTML += `
                    <div class="movie-card">
                        <img src="${item.poster_url || 'https://via.placeholder.com/200x300'}" alt="${item.title}">
                        <div class="movie-info">
                            <h3>${item.title}</h3>
                            <button onclick="viewSessions(${item.id})">Дивитись сеанси</button>
                        </div>
                    </div>
                `;
            } 
            // Якщо це сеанс (має start_time), малюємо сеанс
            else if (item.start_time) {
                displayElement.innerHTML += `
                    <div class="session-item">
                        <p>Час: <strong>${item.start_time}</strong></p>
                        <button onclick="book(${item.id})">Бронювати квиток</button>
                    </div>
                `;
            }
        });
    })
    .catch(err => {
        console.error(err);
        displayElement.innerHTML = "<p style='color:red;'>Помилка зв'язку з сервером. Перевірте, чи запущено FastAPI.</p>";
    });
}

window.viewSessions = (movieId) => {
    window.location.href = `index.html?id=${movieId}`;
};

window.book = (sessionId) => {
    window.location.href = `booking.html?session=${sessionId}`;
};
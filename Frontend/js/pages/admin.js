const BASE_URL = "http://127.0.0.1:8005/api";

document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('user_id');
    const userEmail = localStorage.getItem('user_email');
    const firstName = localStorage.getItem('first_name') || ""; // Додаємо зчитування імені

    const ADMIN_EMAIL = "mariexssin@gmail.com"; 

    // ОНОВЛЕНО: Тепер сторінка пустить тебе, якщо ім'я "admin" АБО правильна пошта
    const isUserAdmin = firstName.toLowerCase() === 'admin' || userEmail === ADMIN_EMAIL || userId == 1;

    if (!userId || !isUserAdmin) {
        alert("Доступ заборонено! Ви не є адміністратором.");
        window.location.href = 'index.html'; 
        return;
    }

    const form = document.getElementById('movieForm');
    const moviesList = document.getElementById('adminMoviesList');
    const cancelBtn = document.getElementById('cancelEdit');

    async function fetchAdminMovies() {
        try {
            const res = await fetch(`${BASE_URL}/movies`);
            if (!res.ok) throw new Error("Не вдалося завантажити фільми");
            const movies = await res.json();
            moviesList.innerHTML = "";

            movies.forEach(movie => {
                const item = document.createElement('div');
                item.style = "background: #222; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border: 1px solid #333;";
                item.innerHTML = `
                    <div>
                        <strong style="font-size: 1.1rem; color: #fff;">${movie.title}</strong>
                    </div>
                    <button class="edit-btn" style="background: #444; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Редагувати</button>
                `;
                
                item.querySelector('.edit-btn').onclick = () => {
                    startEdit(movie.id, movie.title, movie.description);
                };
                
                moviesList.appendChild(item);
            });
        } catch (e) { 
            console.error(e); 
            moviesList.innerHTML = "<p style='color: gray;'>Поки що немає доданих фільмів або сервер офлайн.</p>";
        }
    }

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();

            const id = document.getElementById('movieId').value;
            const title = document.getElementById('movieTitle').value;
            const description = document.getElementById('movieDesc').value;
            const posterFile = document.getElementById('moviePoster').files[0];

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (posterFile) {
                formData.append('poster', posterFile);
            }

            const url = id ? `${BASE_URL}/movies/${id}` : `${BASE_URL}/movies`;
            const method = id ? 'PUT' : 'POST';

            try {
                const res = await fetch(url, { 
                    method: method, 
                    body: formData 
                });
                
                // Зчитуємо відповідь сервера, навіть якщо там помилка
                const result = await res.json().catch(() => ({}));
                
                if (res.ok) {
                    alert(id ? 'Фільм успішно оновлено!' : 'Фільм успішно додано!');
                    form.reset();
                    resetFormState();
                    fetchAdminMovies(); 
                } else {
                    // ВИВОДИМО ТОЧНУ ПРИЧИНУ ПОМИЛКИ СЕРВЕРА
                    alert('Помилка сервера: ' + (result.detail || 'Невідома помилка збереження'));
                }
            } catch (err) { 
                console.error(err); 
                alert('Критична помилка мережі (перевірте консоль)');
            }
        };
    }

    function startEdit(id, title, desc) {
        document.getElementById('movieId').value = id;
        document.getElementById('movieTitle').value = title;
        document.getElementById('movieDesc').value = desc;
        document.getElementById('submitBtn').innerText = "Оновити дані фільму";
        if (cancelBtn) cancelBtn.style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }

    function resetFormState() {
        document.getElementById('movieId').value = "";
        document.getElementById('submitBtn').innerText = "Зберегти фільм";
        if (cancelBtn) cancelBtn.style.display = "none";
    }

    if (cancelBtn) {
        cancelBtn.onclick = () => { 
            form.reset(); 
            resetFormState(); 
        };
    }

    fetchAdminMovies();
});
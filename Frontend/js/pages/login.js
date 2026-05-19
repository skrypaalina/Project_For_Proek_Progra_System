document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Стабільний запит на Python-бекенд
                const response = await fetch("http://127.0.0.1:8005/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Записуємо дані у браузер
                    localStorage.setItem('user_id', result.user_id);
                    localStorage.setItem('first_name', result.first_name); 
                    localStorage.setItem('user_email', data.email.trim().toLowerCase()); // Рятувальний рядок
                    
                    window.location.href = 'index.html';
                } else {
                    alert(result.detail || "Помилка входу");
                }
            } catch (error) {
                console.error("Помилка:", error);
                alert("Сервер Python не запущено на порту 8005!");
            }
        };
    }
});
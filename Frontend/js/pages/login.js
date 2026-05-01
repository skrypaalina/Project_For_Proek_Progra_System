document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("http://127.0.0.1:8005/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Зберігаємо ВСЕ, що прислав бекенд
                    localStorage.setItem('user_id', result.user_id);
                    localStorage.setItem('first_name', result.first_name); 
                    
                    console.log("Збережено ім'я:", localStorage.getItem('first_name'));
                    
                    // Переходимо на головну
                    window.location.href = 'index.html';
                } else {
                    alert(result.detail || "Помилка входу");
                }
            } catch (error) {
                console.error("Помилка:", error);
            }
        };
    }
});
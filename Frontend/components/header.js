const header = document.getElementById('header');
const userId = localStorage.getItem('user_id');

header.innerHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: #000; color: white;">
        <a href="index.html" style="color: #e50914; font-size: 1.5rem; font-weight: bold; text-decoration: none;">Cinema Star</a>
        <div style="display: flex; gap: 20px; align-items: center;">
            <a href="index.html" style="color: white; text-decoration: none;">Фільми</a>
            ${userId 
                ? `<a href="profile.html" style="color: white; text-decoration: none;">Профіль</a>
                   <a href="#" id="logoutBtn" style="background: #e50914; color: white; padding: 5px 15px; border-radius: 4px; text-decoration: none;">Вийти</a>`
                : `<a href="login.html" style="background: #e50914; color: white; padding: 5px 15px; border-radius: 4px; text-decoration: none;">Увійти</a>`
            }
        </div>
    </nav>
`;

if (userId) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user_id');
        window.location.href = "index.html";
    });
}
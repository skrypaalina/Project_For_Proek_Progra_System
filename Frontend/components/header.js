const renderHeader = () => {
    const header = document.getElementById('header');
    if (!header) return;

    const userId = localStorage.getItem('user_id');
    const firstName = localStorage.getItem('first_name');
    const initial = (firstName && firstName !== 'null') ? firstName.charAt(0).toUpperCase() : 'M';
    
    // Прямий шлях до Барбі
    const userPhoto = "images/avatar.png"; 

    header.innerHTML = `
        <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: #000; color: white; border-bottom: 1px solid #333; width: 100%; box-sizing: border-box;">
            <a href="index.html" style="color: #e50914; font-size: 1.5rem; font-weight: bold; text-decoration: none;">Cinema Star</a>
            <div style="display: flex; gap: 20px; align-items: center;">
                <a href="index.html" style="color: white; text-decoration: none; font-size: 1rem;">Фільми</a>
                ${userId ? `
                    <div style="position: relative; display: flex; align-items: center;">
                        <div id="profileAvatar" style="cursor: pointer; width: 40px; height: 40px; background: #e50914; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; overflow: hidden; border: 1px solid #444;">
                            
                            <img src="${userPhoto}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 1.2rem;">${initial}</div>
                            
                        </div>
                        <div id="dropdownMenu" style="display: none; position: absolute; right: 0; top: 50px; background: #1a1a1a; border-radius: 8px; padding: 10px 0; min-width: 150px; border: 1px solid #333; z-index: 1000; flex-direction: column;">
                            <a href="profile.html" style="color: white; text-decoration: none; padding: 10px 20px; display: block; font-size: 0.9rem;">Мій профіль</a>
                            <div style="height: 1px; background: #333; margin: 2px 0;"></div>
                            <a href="#" id="logoutBtn" style="color: #e50914; text-decoration: none; padding: 10px 20px; display: block; font-size: 0.9rem;">Вийти</a>
                        </div>
                    </div>` : `<a href="login.html" style="background: #e50914; color: white; padding: 8px 20px; border-radius: 4px; text-decoration: none;">Увійти</a>`}
            </div>
        </nav>`;

    if (userId) {
        const avatar = document.getElementById('profileAvatar');
        const dropdown = document.getElementById('dropdownMenu');
        if (avatar && dropdown) {
            avatar.onclick = (e) => { 
                e.stopPropagation(); 
                dropdown.style.display = (dropdown.style.display === 'flex') ? 'none' : 'flex'; 
            };
            document.onclick = () => dropdown.style.display = 'none';
        }
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => { 
                e.preventDefault();
                localStorage.clear(); 
                window.location.href = 'index.html'; 
            };
        }
    }
};
renderHeader();
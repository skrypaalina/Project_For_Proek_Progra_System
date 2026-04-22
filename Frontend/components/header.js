const header = document.getElementById('header');
const userId = localStorage.getItem('user_id');
const firstName = localStorage.getItem('first_name') || 'U'; 
const initial = firstName.charAt(0).toUpperCase(); 

header.innerHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background: #000; color: white; width: 100%; box-sizing: border-box;">
        
        <div style="flex: 1;">
            <a href="index.html" style="color: #e50914; font-size: 1.5rem; font-weight: bold; text-decoration: none; letter-spacing: 1px;">Cinema Star</a>
        </div>
        
        <div style="display: flex; gap: 30px; align-items: center; justify-content: flex-end; flex: 1;">
            <a href="index.html" style="color: white; text-decoration: none; font-size: 1rem;">Фільми</a>
            
            ${userId 
                ? `
                   <div style="position: relative;" id="profileContainer">
                       
                       <div id="profileAvatar" style="cursor: pointer; width: 40px; height: 40px; background: #e50914; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; border: 2px solid transparent; transition: 0.3s; user-select: none;">
                           ${initial}
                       </div>
                       
                       <div id="dropdownMenu" style="display: none; position: absolute; right: 0; top: 55px; background: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.8); padding: 10px 0; min-width: 150px; z-index: 1000; flex-direction: column;">
                           <a href="profile.html" style="color: white; text-decoration: none; padding: 10px 20px; display: block; font-size: 0.95rem;">Мій профіль</a>
                           <div style="height: 1px; background: #333; margin: 5px 0;"></div>
                           <a href="#" id="logoutBtn" style="color: #e50914; text-decoration: none; padding: 10px 20px; display: block; font-size: 0.95rem;">Вийти</a>
                       </div>
                       
                   </div>
                  `
                : `<a href="login.html" style="background: #e50914; color: white; padding: 8px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">Увійти</a>`
            }
        </div>
    </nav>
`;

if (userId) {
    const avatar = document.getElementById('profileAvatar');
    const dropdown = document.getElementById('dropdownMenu');
    
    avatar.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if (dropdown.style.display === 'none') {
            dropdown.style.display = 'flex';
            avatar.style.border = '2px solid white'; 
        } else {
            dropdown.style.display = 'none';
            avatar.style.border = '2px solid transparent';
        }
    });

    document.addEventListener('click', (e) => {
        if (dropdown.style.display === 'flex' && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
            avatar.style.border = '2px solid transparent';
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user_id');
        localStorage.removeItem('first_name');
        window.location.href = "index.html";
    });
}
document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('user_id');
    const container = document.getElementById('ticketsContainer');
    const historyContainer = document.getElementById('historyContainer');

    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    async function loadData() {
        try {
            // Квитки
            const tRes = await fetch(`http://127.0.0.1:8005/api/users/${userId}/tickets`);
            if (tRes.ok) {
                const tickets = await tRes.json();
                const now = new Date();
                let activeHtml = '';
                let historyHtml = '';

                tickets.forEach(t => {
                    const [datePart, timePart] = t.session_time.split(' ');
                    const [day, month] = datePart.split('.');
                    const [hours, minutes] = timePart.split(':');
                    const sessionDate = new Date(new Date().getFullYear(), month - 1, day, hours, minutes);

                    const cardHtml = `
                        <div style="background: #1a1a1a; padding: 25px; border-radius: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid #e50914; opacity: ${sessionDate < now ? '0.6' : '1'};">
                            <div>
                                <h3 style="margin: 0; color: #fff;">${t.movie_title}</h3>
                                <p style="margin: 5px 0 0 0; color: #aaa;">📅 ${t.session_time}</p>
                            </div>
                            <div style="background: ${sessionDate < now ? '#444' : '#e50914'}; padding: 10px 20px; border-radius: 8px; font-weight: bold;">${t.seat}</div>
                        </div>`;
                    
                    if (sessionDate < now) historyHtml += cardHtml;
                    else activeHtml += cardHtml;
                });

                if (container) container.innerHTML = activeHtml || "<p>Активних квитків немає</p>";
                if (historyContainer) historyContainer.innerHTML = historyHtml || "<p>Історія порожня</p>";
            }

            // Дані профілю
            const uRes = await fetch(`http://127.0.0.1:8005/api/users/${userId}`);
            if (uRes.ok) {
                const user = await uRes.json();
                document.getElementById('userName').innerText = user.first_name;
                document.getElementById('userBonuses').innerText = user.bonuses || 0;
                
                // ОСЬ МАГІЯ: Якщо база віддає фотку, ставимо її і ділимося з хедером!
                if (user.photo_url) {
                    document.getElementById('profileImage').src = user.photo_url;
                    localStorage.setItem('user_photo', user.photo_url); // Зберігаємо для хедера
                    
                    // Одразу оновлюємо маленьку іконку
                    const headerImg = document.querySelector('#profileAvatar img');
                    const headerInitial = document.querySelector('#profileAvatar div:nth-child(2)');
                    if (headerImg && headerInitial) {
                        headerImg.src = user.photo_url;
                        headerImg.style.display = 'block';
                        headerInitial.style.display = 'none';
                    }
                }
            }
        } catch (e) { console.error(e); }
    }
    loadData();
});
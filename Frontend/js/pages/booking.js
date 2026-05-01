const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');
const BASE_URL = "http://127.0.0.1:8005/api";

let selectedSeats = []; 

async function loadSeats() {
    const grid = document.getElementById('seats-grid');
    const selectedCount = document.getElementById('selected-count');
    const totalPrice = document.getElementById('total-price');

    try {
        const response = await fetch(`${BASE_URL}/sessions/${sessionId}/seats`);
        const seats = await response.json();

        grid.innerHTML = "";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(10, 40px)";
        grid.style.justifyContent = "center";
        grid.style.gap = "10px";

        seats.forEach(seat => {
            const seatDiv = document.createElement('div');
            seatDiv.style.width = "40px";
            seatDiv.style.height = "40px";
            seatDiv.style.borderRadius = "5px";
            seatDiv.style.display = "flex";
            seatDiv.style.alignItems = "center";
            seatDiv.style.justifyContent = "center";
            seatDiv.style.fontSize = "12px";
            seatDiv.innerText = seat.seat_number;

            if (!seat.is_available) {
                seatDiv.style.background = "#222"; 
                seatDiv.style.color = "#555";
                seatDiv.style.cursor = "not-allowed";
            } else {
                seatDiv.style.background = "#444"; 
                seatDiv.style.color = "white";
                seatDiv.style.cursor = "pointer";
                
                seatDiv.onclick = () => {
                    if (selectedSeats.includes(seat.seat_number)) {
                        selectedSeats = selectedSeats.filter(num => num !== seat.seat_number);
                        seatDiv.style.background = "#444";
                    } else {
                        selectedSeats.push(seat.seat_number);
                        seatDiv.style.background = "#e50914"; 
                    }
                    selectedCount.innerText = selectedSeats.length;
                    totalPrice.innerText = selectedSeats.length * (seat.price || 150);
                };
            }
            grid.appendChild(seatDiv);
        });
    } catch (err) {
        console.error("Помилка:", err);
    }
}

document.getElementById('buy-btn').onclick = async (e) => {
    e.preventDefault(); 

    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
        alert("Будь ласка, авторизуйтесь!");
        return;
    }

    if (selectedSeats.length === 0) {
        alert("Оберіть місця!");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8005/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: parseInt(sessionId),
                seats: selectedSeats.map(s => parseInt(s)), 
                user_id: parseInt(userId)
            })
        });

        if (response.ok) {
            alert("Квитки куплено! Бонуси нараховано.");
            window.location.href = "profile.html"; 
        } else {
            const err = await response.json();
            alert("Помилка: " + (err.detail || "Невідома помилка"));
        }
    } catch (e) {
        alert("Сервер 8005 не відповідає. Перевір термінал!");
    }
};

loadSeats();
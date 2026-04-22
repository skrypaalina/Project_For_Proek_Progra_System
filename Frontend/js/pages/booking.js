const hall = document.getElementById("hall");

const params = new URLSearchParams(window.location.search);
const session_id = params.get("session_id"); 

const rows = 5;
const cols = 10;

let selectedSeats = [];
let takenSeats = [];

function createHall() {
    hall.innerHTML = "";
    for (let i = 1; i <= rows * cols; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");

        if (takenSeats.includes(i)) {
            seat.classList.add("taken");
        }

        seat.innerText = i;
        seat.onclick = () => selectSeat(seat, i);
        hall.appendChild(seat);
    }
}

function selectSeat(el, id) {
    if (el.classList.contains("taken")) return;

    if (selectedSeats.includes(id)) {
        selectedSeats = selectedSeats.filter(s => s !== id);
        el.classList.remove("selected");
    } else {
        selectedSeats.push(id);
        el.classList.add("selected");
    }
}

function loadTakenSeats() {
    fetch(`/api/booking/${session_id}`)
    .then(res => {
        if (!res.ok) throw new Error("Сервер не знайшов адресу");
        return res.json();
    })
    .then(data => {
        takenSeats = data;
        createHall();
    })
    .catch((err) => {
        console.error("Деталі помилки завантаження:", err);
        alert("Помилка завантаження місць");
    });
}

function buy() {
    if (selectedSeats.length === 0) {
        alert("Оберіть хоча б одне місце");
        return;
    }

    fetch("/api/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            session_id: parseInt(session_id),
            seats: selectedSeats
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Помилка при збереженні");
        return res.json();
    })
    .then(() => {
        alert("Квитки успішно куплено! 🍿");
        selectedSeats = []; 
        loadTakenSeats(); 
    })
    .catch((err) => {
        console.error("Деталі помилки бронювання:", err);
        alert("Помилка бронювання");
    });
}

if (session_id) {
    loadTakenSeats();
} else {
    alert("Помилка: не знайдено ID сеансу");
}
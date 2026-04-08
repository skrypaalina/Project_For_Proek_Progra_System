const hall = document.getElementById("hall");

// отримуємо session_id з URL
const params = new URLSearchParams(window.location.search);
const session_id = params.get("session");

// розміри залу
const rows = 5;
const cols = 10;

let selectedSeats = [];
let takenSeats = [];

// 🎯 створення залу
function createHall() {

    hall.innerHTML = "";

    for (let i = 1; i <= rows * cols; i++) {

        const seat = document.createElement("div");
        seat.classList.add("seat");

        // зайняті місця
        if (takenSeats.includes(i)) {
            seat.classList.add("taken");
        }

        seat.innerText = i;

        seat.onclick = () => selectSeat(seat, i);

        hall.appendChild(seat);
    }
}

// 🎯 вибір місця
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

// 🎯 отримання зайнятих місць з бекенду
function loadTakenSeats() {

    fetch(`http://127.0.0.1:8000/booking/${session_id}`)
    .then(res => res.json())
    .then(data => {
        // очікується список типу [1,5,7]
        takenSeats = data;
        createHall();
    })
    .catch(() => {
        alert("Помилка завантаження місць");
    });
}

// 🎯 покупка
function buy() {

    if (selectedSeats.length === 0) {
        alert("Оберіть місця");
        return;
    }

    fetch("http://127.0.0.1:8000/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            session_id: session_id,
            seats: selectedSeats
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Квитки куплено");
        loadTakenSeats(); // оновити зал
    })
    .catch(() => {
        alert("Помилка бронювання");
    });
}

// 🚀 запуск
loadTakenSeats();
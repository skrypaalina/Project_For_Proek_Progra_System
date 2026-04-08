const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`http://127.0.0.1:8000/sessions/${id}`)
.then(res => res.json())
.then(data => {
    const div = document.getElementById("sessions");

    data.forEach(s => {
        div.innerHTML += `
            <p>${s.start_time}</p>
            <button onclick="book(${s.id})">Бронювати</button>
        `;
    });
});

window.book = (id) => {
    window.location.href = "booking.html?session=" + id;
};
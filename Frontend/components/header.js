const header = document.getElementById("header");

header.innerHTML = `
    <div class="logo">CINEMA</div>
    <div>
        <button onclick="goLogin()">Login</button>
    </div>
`;

window.goLogin = () => {
    window.location.href = "login.html";
};
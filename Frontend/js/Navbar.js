const Home = document.getElementById("nav-item-Home");
const Registrar = document.getElementById("nav-item-Registrarme");
const IniciarSesion = document.getElementById("nav-item-IniciarSesion");
const logo_navbar = document.getElementById("logo_navbar");

logo_navbar.addEventListener("click", (e) => {
    e.preventDefault();
    if (!window.location.href.includes("Home.html")) {
        window.location.href = "Home.html";
    }
});

Home.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Home.html";
});

Registrar.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Signup.html";
});


IniciarSesion.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Signin.html";
});


const leave = document.getElementById("exit_user");
const mi_usuario = document.getElementById("nav-item-modificar_datos");
const mis_datos = document.getElementById("nav-item-mis-datos");

mi_usuario.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "MisDatos.html";
});

leave.addEventListener("click", (e) => {
    e.preventDefault();
    if (!window.location.href.includes("Home.html")) {
        sessionStorage.removeItem("user_data");
        window.location.href = "Home.html";
    }
});

mi_usuario.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "ModificarUsuario.html";
});



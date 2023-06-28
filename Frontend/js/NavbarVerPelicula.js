const leave = document.getElementById("exit_user");
const mis_datos = document.getElementById("nav-item-mis-datos");

mis_datos.addEventListener("click", (e) => {
    e.preventDefault();
    if(window.location.href.includes("MisDatos.html")) return;
    window.location.href = "ModificarUsuario.html";
});

leave.addEventListener("click", (e) => {
    e.preventDefault();
    
    window.location.href = "ClientDashboard.html";
    sessionStorage.removeItem("movie_data");
    
});






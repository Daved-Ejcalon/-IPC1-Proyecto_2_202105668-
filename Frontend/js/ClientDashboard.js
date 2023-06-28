//Datos peliculas
const titulo_pagina = document.getElementById("titulo_pagina");
const body = document.querySelector("body");

const btnPeliculas = document.getElementById("nav-item-peliculas");
const btnPlaylist = document.getElementById("nav-item-playlist");

var userData = sessionStorage.getItem("user_data");

body.onload = function () {
    var userData = sessionStorage.getItem("user_data");

    //Obtener usuario de session storage
    if (!userData) {
        // Los datos no existen en el sessionStorage
        console.log("No se encontraron datos de sesion actual.");
        //window.location.href = "Home.html";
    }

    //Cargar peliculas
    actualizarPeliculas();
}

btnPeliculas.onclick = function (e) {
    e.preventDefault();
    titulo_pagina.textContent = "Peliculas en Sistema";
    actualizarPeliculas();
}

btnPlaylist.onclick = function (e) {
    e.preventDefault();
    titulo_pagina.textContent = "Mi Playlist";
    actualizarPlaylist();
}

function actualizarPeliculas(){

    document.querySelector(".cards").innerHTML = "";

    fetch(`http://127.0.0.1:5000//getPeliculas/`,{
    }).then(response => response.json())
    .then(res =>{
        if(res.message == 'Succes'){
            for (var i = 0; i < res.peliculas.length; i++) {
                var pelicula = res.peliculas[i];
                Playlist(pelicula.link, pelicula.nombre,pelicula.anio );
            }
        }
        
    }).catch(error => {
        console.error('Error:', error)
    });
}

function actualizarPlaylist(){

    var userData = sessionStorage.getItem("user_data");

    //Obtener usuario de session storage
    if (!userData) {// Los datos no existen en el sessionStorage
        console.log("No se encontraron datos de sesion actual.");
        //window.location.href = "Home.html";
    }else{
        var dataSessionStorage = JSON.parse(userData);
        const usuario = dataSessionStorage.nombreUsuario;
        document.querySelector(".cards").innerHTML = "";
    
        fetch(`http://127.0.0.1:5000//getPlaylist/${usuario}`,{
        }).then(response => response.json())
        .then(res =>{
            if(res.message == 'Succes'){
                for (var i = 0; i < res.peliculas.length; i++) {
                    var pelicula = res.peliculas[i];
                    Playlist(pelicula.link, pelicula.nombre,pelicula.anio );
                }
            }
            
        }).catch(error => {
            console.error('Error:', error)
        });
    }
}

function Playlist(enlace, nombre, anio) {

    const cardsContainer = document.querySelector(".cards");

    // Crea el elemento card
    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "20rem";

    // Crea el contenedor del video
    const videoContainer = document.createElement("div");
    videoContainer.id = "videoContainer";
    videoContainer.className = "videoContainer";

    const videoId = obtenerVideoId(enlace);
    const embedCode = '<iframe width="300" height="160" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    videoContainer.innerHTML = embedCode;

    card.appendChild(videoContainer);

    // Crea la lista de elementos
    var listGroup = document.createElement("ul");
    listGroup.className = "list-group list-group-flush";

    // Crea el elemento de nombre de película
    var nombrePelicula = document.createElement("li");
    nombrePelicula.className = "list-group-item";
    nombrePelicula.id = "nombre_pelicula";
    nombrePelicula.textContent = "Nombre: " + nombre;
    listGroup.appendChild(nombrePelicula);

    // Crea el elemento de año de película
    var anioPelicula = document.createElement("li");
    anioPelicula.className = "list-group-item";
    anioPelicula.id = "anio_pelicula";
    anioPelicula.textContent = "Año: " + anio;
    listGroup.appendChild(anioPelicula);

    card.appendChild(listGroup);

    // Crea el elemento de botones
    var cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Crea el botón de ver
    var btnVer = document.createElement("a");
    btnVer.className = "btn btn-success";
    btnVer.innerHTML = '<i class="far fa-eye"></i> Ver';
    cardBody.appendChild(btnVer);

    // Crea el botón de agregar a playlist
    var btnPlaylist = document.createElement("a");
    btnPlaylist.className = "btn btn-primary";
    btnPlaylist.textContent = "Agregar a mi playlist";
    cardBody.appendChild(btnPlaylist);

    card.appendChild(cardBody);

    // Agrega la card al contenedor
    cardsContainer.appendChild(card);

    // Agrega event listeners a los botones
    btnVer.addEventListener("click", function (event) {
        // Lógica para el evento de clic del botón "Ver"
        event.preventDefault();

        const data = {
            'nombre': nombre
        }
        sessionStorage.setItem("movie_data", JSON.stringify(data)) // Guarda los datos de la película en sessionStorage
        window.location.href = "VerPelicula.html";
    });
    
    btnPlaylist.addEventListener("click", function (event) {
        event.preventDefault();
       

        //Obtener usuario de session storage
        if (!userData) {// Los datos no existen en el sessionStorage
            console.log("No se encontraron datos de sesion actual.");
            //window.location.href = "Home.html";
        }else{
            var dataSessionStorage = JSON.parse(userData);
            const nombreUsuario = dataSessionStorage.nombreUsuario;

            console.log("Se encontro el usuario"+nombreUsuario)
            const data = {
                'nombre': nombre
            };

            console.log(data);

            fetch(`http://127.0.0.1:5000//addPeliculaToPlaylist/${nombreUsuario}`,{
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then(res =>{
                switch (res.message) {
                    case 'Succes':{
                        alert("Se agrego la pelicula a tu playlist");
                    }
                        break;
                    case 'PeliculaExist':{
                        alert("La pelicula ya esta en tu playlist");
                    }
                        break;
                    case 'NotClient':{
                        alert("No se encontro el usuario");
                    }
                        break;
                
                    default:
                        break;
                }
                
            }).catch(error => {
                console.error('Error:', error)
            });
        }
    });

    function obtenerVideoId(url) {
        // Expresión regular para extraer el ID del video de YouTube
        var regex = /(?:[?&]|\b)v=([^&#]+)/;
        var match = url.match(regex);
    
        if (match && match[1]) {
            return match[1];
        } else {
            return "";
        }
    }

}

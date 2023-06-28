const btn_comentar = document.getElementById("submit_comentario");
const body = document.querySelector("body");
var movieData = sessionStorage.getItem("movie_data");
//Comentarios

body.onload = function () {
    //Obtener usuario de session storage
    if (!movieData) {
        // Los datos no existen en el sessionStorage
        console.log("No se encontraron datos de pelicula a ver.");
        //window.location.href = "Home.html";
    }else{

        let dataSessionStorage = JSON.parse(movieData);
        const nombrePelicula = dataSessionStorage.nombre;

        fetch(`http://127.0.0.1:5000//getPeliculas/`,{ //Obtener datos de la pelicula
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error)
        }).then(res =>{
            if(res.message == 'Succes'){ //Si se obtuvieron los datos
                res.peliculas.forEach(pelicula => {
                    
                    if(pelicula.nombre == nombrePelicula){
                        //Actualizar datos de la pelicula
                        actualizarDatosPelicula(pelicula.nombre, pelicula.genero, pelicula.clasificacion, pelicula.anio, pelicula.duracion, pelicula.link); 

                        //Llenar tabla de comentarios
                        actualizarComentarios();
                    }
                });
                
            }
            
        });
       
    }

}

btn_comentar.addEventListener("click", function (e) {
    e.preventDefault();
    const input_comentario = document.getElementById("input_comentario");
    const nombrePelicula = JSON.parse(movieData).nombre;
    const usuarioComentario = JSON.parse(sessionStorage.getItem("user_data"))?.nombreUsuario;
    
    const data = {
        'nombrePelicula': nombrePelicula,
        'usuario':usuarioComentario,
        'comentario': input_comentario.value
    }

    fetch(`http://127.0.0.1:5000//addComentarioPelicula/`,{ //Obtener datos de la pelicula
    method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(res =>{
        console.log(res);
        if(res.message == 'Succes'){ //Si se pudo agregar el comentario
            alert('Comentario agregado');
            actualizarComentarios(); //Actualizar comentarios
        }
        
    }).catch(error => {
        console.error('Error:', error)
    });

    //Limpiar input
    input_comentario.value = '';
});

function actualizarComentarios() {
    let dataSessionStorage = JSON.parse(movieData);
    const nombrePelicula = dataSessionStorage.nombre;

    fetch(`http://127.0.0.1:5000//getComentarios/${nombrePelicula}`,{ //Obtener datos de la pelicula
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error)
        }).then(res =>{
            console.log(res);
            if(res.message == 'Succes'){ //Si se obtuvieron los datos
                //Llenar tabla de comentarios

                document.getElementById("tbody_tabla_comentarios").innerHTML = ''; //Limpiar tabla
                res.comentarios.forEach(comentario => { //Llenar tabla de comentarios
                    llenarTablaComentarios(comentario.usuario, comentario.comentario);
                });
            }
            
        });
}

//Datos pelicula
function llenarTablaComentarios(usuario, comentario) {
    // Obtén la referencia a la tabla por su ID
    var table = document.getElementById("tbody_tabla_comentarios");

    // Crea una nueva fila y agrega celdas a la misma
    var newRow = table.insertRow();

    // Agrega celdas a la nueva fila
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = usuario; // Contenido de la primera celda

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = comentario; // Contenido de la segunda celda
}

function actualizarDatosPelicula(nombre, genero, clasificacion, anio, duracion, enlace) {
    const titulo_pelicula = document.getElementById("titulo_pelicula");
    const genero_pelicula = document.getElementById("genero_pelicula");
    const duracion_pelicula = document.getElementById("duracion_pelicula");
    const clasificacion_pelicula = document.getElementById("clasificacion_pelicula");
    const anio_pelicula = document.getElementById("anio_pelicula");
    const containerVideo = document.getElementById("videoContainer");

    titulo_pelicula.innerHTML = 'Nombre: '+nombre;
    genero_pelicula.innerHTML = 'Genero: '+genero;
    duracion_pelicula.innerHTML = 'Duración: '+duracion;
    clasificacion_pelicula.innerHTML = 'Clasificación: '+clasificacion;
    anio_pelicula.innerHTML = 'Año de salida: '+anio;
    
    const videoId = obtenerVideoId(enlace);
    const embedCode = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    containerVideo.innerHTML = embedCode;

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

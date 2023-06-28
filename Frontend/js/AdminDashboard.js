// Obtén una referencia a todos los botones de "Ver datos" en la tabla
var btnsVerDatos = document.getElementsByClassName('btn_ver_pelicula');
const body = document.querySelector("body");

const btnSignup = document.getElementById("btn_registrar_admin");
const inputCargaPelliculas = document.getElementById("btn_carga_peliculas");


body.onload = function () {

    var userData = sessionStorage.getItem("user_data");

    //Obtener usuario de session storage
    if (!userData) {// Los datos no existen en el sessionStorage
        console.log("No se encontraron datos de sesion actual.");
        //window.location.href = "Home.html";
    }
    
    // Cargar peliculas
    actualizarPeliculas();
    actualizarUsuarios();
};

// Crear usuario (administrador)
btnSignup.addEventListener('click', (e) => {
    e.preventDefault();
    const userInput = document.getElementById("inputUsuario");
    const inputPassword = document.getElementById("inputPassword");
    const nombreInput = document.getElementById("inputNombre");
    const apellidoInput = document.getElementById("inputApellido");

    const user = userInput.value;
    const password = inputPassword.value;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;

    const data = {
        'tipo': 'administrador', // Se crea un administrador por defecto
        'nombre': nombre,
        'apellido': apellido,
        'usuario': user,
        'password': password
    }

    fetch(`http://127.0.0.1:5000//registro/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(res => {
            switch (res.message) {
                case 'AdminExist': {
                    alert(`Ya existe el administrador ${user}, intenta con otro`)
                    userInput.value = ''
                }
                    break;

                case 'SuccesAdmin': {
                    alert(`Credenciales correctas, administrador ${user} registrado`)
                    userInput.value = ''
                    inputPassword.value = ''
                    nombreInput.value = ''
                    apellidoInput.value = ''
                }
                    break;

                default: {
                    alert("Datos incorrectos, intenta de nuevo")
                }
                    break;
            }

        }).catch(error => {
            console.error('Error:', error)
        });
});

// Cargar peliculas
inputCargaPelliculas.addEventListener('change', (e) => {
    e.preventDefault();

    // Obtener el archivo seleccionado
    var file = e.target.files[0];

    // Crear un objeto FileReader
    var reader = new FileReader();

    // Definir la función de carga (se ejecuta cuando se haya leído el archivo)
    reader.onload = function (event) {
        // Obtener el contenido del archivo como una cadena
        var fileContent = event.target.result;

        // Procesar el contenido del archivo
        var lines = fileContent.split('\n');
        
        for (var i = 1; i < lines.length; i++) { // Se inicia en 1 para evitar la primera linea (encabezados)
            var line = lines[i];
            var movieData = line.split(';');

            if (movieData.length === 6) {
                const data = {
                    'nombre': movieData[0].trim(),
                    'genero': movieData[1].trim(),
                    'clasificacion': movieData[2].trim(),
                    'anio': movieData[3].trim(),
                    'duracion': movieData[4].trim(),
                    'linkYouTube': movieData[5].trim()
                };
                
    
                fetch(`http://127.0.0.1:5000//addPelicula/`,{
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                    .then(res =>{
                        switch (res.message) {
                            case 'EmptyFields':{
                                alert("No se permiten campos vacios")
                            } break;
                            case 'PeliculaExist':{
                                alert(`Ya existe la pelicula ${data.nombre}, intenta con otra`)
                            } break;
                            case 'Succes':{
                                llenarTablaPelicula(data.nombre, data.genero, data.clasificacion, data.anio, data.duracion);
                            }
                                break;
                            default:{
                                alert("Datos incorrectos de pelicula")
                            }
                                break;
                        }
                        
                    }).catch(error => {
                        console.error('Error:', error)
                    });
            }

        }

        
    };
    // Leer el contenido del archivo como texto
    reader.readAsText(file);
    inputCargaPelliculas.value = '';
    alert(`Se cargaron las peliculas`);
});

function actualizarPeliculas(){
    fetch(`http://127.0.0.1:5000//getPeliculas/`,{
    }).then(response => response.json())
        .then(res =>{
            if(res.message == 'Succes'){
                document.getElementById("tbody_tabla_peliculas").innerHTML = ''; // Limpiar tabla
                for (var i = 0; i < res.peliculas.length; i++) {
                    var pelicula = res.peliculas[i];
                    llenarTablaPelicula(pelicula.nombre, pelicula.genero, pelicula.clasificacion, pelicula.anio, pelicula.duracion);
                }
            }
            
        }).catch(error => {
            console.error('Error:', error)
        })
}

function actualizarUsuarios(){
    fetch(`http://127.0.0.1:5000//getClientes/`,{
    }).then(response => response.json())
        .then(res =>{
            if(res.message == 'Succes'){
                document.getElementById("tbody_tabla_usuarios").innerHTML = ''; // Limpiar tabla
                for (var i = 0; i < res.clientes.length; i++) {
                    var usuario = res.clientes[i];
                    llenarTablaUsuario(usuario.nombreUsuario, usuario.nombre, usuario.apellido);
                }
            }
            
        }).catch(error => {
            console.error('Error:', error)
        })
}

function llenarTablaPelicula(nombre, genero, clasificacion, anio, duracion) {
    // Obtén la referencia a la tabla por su ID
    var table = document.getElementById("tbody_tabla_peliculas");

    // Crea una nueva fila y agrega celdas a la misma
    var newRow = table.insertRow();

    // Agrega celdas a la nueva fila
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = nombre; // Contenido de la primera celda

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = genero; // Contenido de la segunda celda

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = clasificacion; // Contenido de la tercera celda

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = anio; // Contenido de la cuarta celda

    var cell6 = newRow.insertCell(4);
    cell6.innerHTML = duracion; // Contenido de la sexta celda

    var cell7 = newRow.insertCell(5);
    cell7.innerHTML = `
    <button type="button" class="btn btn-primary btn_ver_pelicula" data-bs-toggle="tooltip" data-toggle="modal" data-target="#modal_body"
        data-bs-placement="top" title="Ver datos"><i class="far fa-eye"></i></button>
    <button type="button" class="btn btn-success btn_editar_pelicula" data-bs-toggle="tooltip" data-toggle="modal" data-target="#modal_body"
        data-bs-placement="top" title="Editar informacion"><i class="fas fa-edit"></i></button>
    <button type="button" class="btn btn-info btn_comentarios_pelicula" data-bs-toggle="tooltip" data-toggle="modal" data-target="#modal_body"
        data-bs-placement="top" title="Comentarios"><i class="far fa-comments"></i></button>
    <button type="button" class="btn btn-danger btn_eliminar_pelicula" data-bs-toggle="tooltip" title="Eliminar"
        data-bs-placement="top"><i class="far fa-trash-alt"></i></button>`; // Contenido de la séptima celda

    // Agrega los eventListeners a los botones de la nueva fila
    var verButton = cell7.querySelector(".btn_ver_pelicula");
    verButton.addEventListener("click", function (e) {
        e.preventDefault();
        // Encuentra el nombre de la película en la misma fila del botón
        var fila = this.closest('tr'); // Obtiene la fila padre del botón
        var nombrePelicula = fila.querySelector('td:nth-child(1)').textContent;

        document.getElementById("modal_body_tabla").innerHTML = "" // Limpiar el cuerpo del modal
        // Realiza la acción que deseas con el nombre de la película
        generarModalInfoPelicula(nombrePelicula)
    });

    var editarButton = cell7.querySelector(".btn_editar_pelicula");
    editarButton.addEventListener("click", function (e) {
        e.preventDefault();
        // Encuentra el nombre de la película en la misma fila del botón
        var fila = this.closest('tr'); // Obtiene la fila padre del botón

        var nombrePelicula = fila.querySelector('td:nth-child(1)').textContent;
        document.getElementById("modal_body_tabla").innerHTML = "" // Limpiar el cuerpo del modal
        // Realiza la acción que deseas con el nombre de la película
        generarModalEditPelicula(nombrePelicula);
    });

    var comentariosButton = cell7.querySelector(".btn_comentarios_pelicula");
    comentariosButton.addEventListener("click", function (e) {
        e.preventDefault();
        // Encuentra el nombre de la película en la misma fila del botón
        var fila = this.closest('tr'); // Obtiene la fila padre del botón
        var nombrePelicula = fila.querySelector('td:nth-child(1)').textContent;

        document.getElementById("modal_body_tabla").innerHTML = "" // Limpiar el cuerpo del modal
        generarModalComentarios(nombrePelicula); // Genera el modal de comentarios
    });

    var eliminarButton = cell7.querySelector(".btn_eliminar_pelicula");
    eliminarButton.addEventListener("click", function (e) {
        e.preventDefault();
        // Encuentra el nombre de la película en la misma fila del botón
        var fila = this.closest('tr'); // Obtiene la fila padre del botón
        var nombrePelicula = fila.querySelector('td:nth-child(1)').textContent;

        // Se elimina la pelicula
        fetch(`http://127.0.0.1:5000//eliminarPelicula/${nombrePelicula}`,{
            method: 'DELETE'
        }).then(response => response.json())
            .catch(error => {
                console.error('Error:', error)
            }).then(res =>{
                switch (res.message) {
                    case 'Succes':{
                        alert("Se elimino la pelicula correctamente")
                        actualizarPeliculas(); // Actualiza la tabla de películas
                    }   break;
                    default:{
                        alert("No se pudo eliminar la pelicula")
                    }  break;
                }
                
            });
    });

    // Inicializar los tooltips de Bootstrap
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function llenarTablaUsuario(usuario, nombre, apellido) {
    // Obtén la referencia a la tabla por su ID
    var table = document.getElementById("tbody_tabla_usuarios");

    // Crea una nueva fila y agrega celdas a la misma
    var newRow = table.insertRow();

    // Agrega celdas a la nueva fila
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = usuario; // Contenido de la primera celda

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = nombre; // Contenido de la segunda celda

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = apellido; // Contenido de la tercera celda


    var cell7 = newRow.insertCell(3);
    cell7.innerHTML = `
    <button type="button" class="btn btn-danger btn_eliminar_usuario" data-bs-toggle="tooltip" title="Eliminar"
        data-bs-placement="top"><i class="far fa-trash-alt"></i></button>`; // Contenido de la séptima celda

    // Agrega los eventListeners a los botones de la nueva fila

    var eliminarButton = cell7.querySelector(".btn_eliminar_usuario");
    eliminarButton.addEventListener("click", function (e) {
        e.preventDefault();
        // Encuentra el nombre de la película en la misma fila del botón
        var fila = this.closest('tr'); // Obtiene la fila padre del botón
        var nombreUsuario = fila.querySelector('td:nth-child(1)').textContent;

        // Se elimina el usuario
        fetch(`http://127.0.0.1:5000//eliminarUsuario/${nombreUsuario}`,{
            method: 'DELETE'
        }).then(response => response.json())
            .then(res =>{
                switch (res.message) {
                    case 'SuccesClient':{
                        alert("Se elimino el usuario correctamente")
                        actualizarUsuarios(); // Actualiza la tabla de películas
                    }   break;
                    case 'SuccesAdmin':{
                        alert("Se elimino el usuario correctamente")
                        actualizarUsuarios(); // Actualiza la tabla de películas
                    }   break;
                    default:{
                        alert("No se pudo eliminar el usuario")
                    }  break;
                }
            }).catch(error => {
                console.error('Error:', error)
            });
    });

    // Inicializar los tooltips de Bootstrap
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

// Función para generar la tabla de comentarios
function generarModalComentarios(nombrePelicula){   
    document.getElementById("labelModal").innerHTML = "Comentarios"
    comentarios = []
    //Obtener los comentarios de la pelicula por medio de la api
    fetch(`http://127.0.0.1:5000//getComentarios/${nombrePelicula}`,{
    }).then(response => response.json())
        .then(res =>{
            switch (res.message) {
                case 'Succes':{
                    generarTablaComentarios(res.comentarios) // Generar la tabla de comentarios en el modal
                }   break;
                default:{
                    alert("No se pudo generar los comentarios.")
                }  break;
            }
        }).catch(error => {
            console.error('Error:', error)
        });
    
}

function generarTablaComentarios(comentarios){
    var container = document.createElement("div");
    container.classList.add("container", "tabla-container");

    var row = document.createElement("div");
    row.classList.add("row");

    var col = document.createElement("div");
    col.classList.add("col-12");

    var table = document.createElement("table");
    table.classList.add("table", "table-bordered");

    var thead = document.createElement("thead");
    var encabezado = document.createElement("tr");

    var thUsuario = document.createElement("th");
    thUsuario.textContent = "Usuario";

    var thComentario = document.createElement("th");
    thComentario.textContent = "Comentario";

    encabezado.appendChild(thUsuario);
    encabezado.appendChild(thComentario);

    thead.appendChild(encabezado);

    var tbody = document.createElement("tbody");
    tbody.id = "tbody_tabla_comentarios";

    table.appendChild(thead);
    table.appendChild(tbody);

    col.appendChild(table);
    row.appendChild(col);
    container.appendChild(row);

    // Iterar sobre los comentarios y crear una fila para cada uno
    comentarios.forEach(function(comentario) {
        // Crear una nueva fila
        var fila = document.createElement("tr");

        // Crear celdas para el usuario y el comentario
        var celdaUsuario = document.createElement("td");
        celdaUsuario.textContent = comentario.usuario;

        var celdaComentario = document.createElement("td");
        celdaComentario.textContent = comentario.comentario;

        // Agregar las celdas a la fila
        fila.appendChild(celdaUsuario);
        fila.appendChild(celdaComentario);

        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(fila);
    });

    const tbody_modal =  document.getElementById("modal_body_tabla")
    // Agregar la tabla generada al modal
    tbody_modal.appendChild(container);
}

// Función para generar la informacion de la pelicula
function generarModalInfoPelicula(nombrePelicula){
    document.getElementById("labelModal").innerHTML = "Ver información"
    //Obtener los comentarios de la pelicula por medio de la api
    fetch(`http://127.0.0.1:5000//getPeliculas/`,{
    }).then(response => response.json())
        .then(res =>{
            switch (res.message) {
                case 'Succes':{
                    res.peliculas.forEach(pelicula => {
                        if(pelicula.nombre == nombrePelicula){
                            generarCardInfoPelicula(pelicula.nombre, pelicula.genero, pelicula.clasificacion, pelicula.anio, pelicula.duracion, pelicula.link )
                        }
                    });
                    
                }   break;
                default:{
                    alert("No se pudo generar la información.")
                }  break;
            }
        }).catch(error => {
            console.error('Error:', error)
        });
}

function generarCardInfoPelicula(nombre, genero, clasificacion, anio, duracion, enlace){
    const container = document.createElement("div");
    container.classList.add("contenedor-card");

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
    var generoPelicula = document.createElement("li");
    generoPelicula.className = "list-group-item";
    generoPelicula.id = "genero_pelicula";
    generoPelicula.textContent = "Genero: " + genero;
    listGroup.appendChild(generoPelicula);

    // Crea el elemento de año de película
    var clasiPelicula = document.createElement("li");
    clasiPelicula.className = "list-group-item";
    clasiPelicula.id = "anio_pelicula";
    clasiPelicula.textContent = "Clasificacion: " + clasificacion;
    listGroup.appendChild(clasiPelicula);

    // Crea el elemento de año de película
    var anioPelicula = document.createElement("li");
    anioPelicula.className = "list-group-item";
    anioPelicula.id = "anio_pelicula";
    anioPelicula.textContent = "Año: " + anio;
    listGroup.appendChild(anioPelicula);

    // Crea el elemento de año de película
    var duracionPelicula = document.createElement("li");
    duracionPelicula.className = "list-group-item";
    duracionPelicula.id = "anio_pelicula";
    duracionPelicula.textContent = "Duracion: " + duracion;
    listGroup.appendChild(duracionPelicula);
    
    card.appendChild(listGroup);

    // Agrega la card al contenedor
    container.appendChild(card);

    //Centrar la card en el contenedor
    container.style.margin = "auto";
    container.style.width = "70%";


    const tbody_modal =  document.getElementById("modal_body_tabla")
    // Agregar la tabla generada al modal
    tbody_modal.appendChild(container);

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
// Función para generar la seccion para editar la pelicula

function generarModalEditPelicula(nombrePelicula){
    
    generarFormEditPelicula(nombrePelicula)
    /*
    //Obtener los comentarios de la pelicula por medio de la api
    fetch(`http://127.0.0.1:5000//editarPelicula/`,{
    }).then(response => response.json())
        .then(res =>{
            switch (res.message) {
                case 'Succes':{
                    res.peliculas.forEach(pelicula => {
                        if(pelicula.nombre == nombrePelicula){
                            generarCardInfoPelicula(pelicula.nombre, pelicula.genero, pelicula.clasificacion, pelicula.anio, pelicula.duracion, pelicula.link )
                        }
                    });
                    
                }   break;
                default:{
                    alert("No se pudo generar la información.")
                }  break;
            }
        }).catch(error => {
            console.error('Error:', error)
        });
    */
}

function generarFormEditPelicula(nombrePelicula){
    document.getElementById("labelModal").innerHTML = "Editar información"

    //Generar el formulario para editar la pelicula
    const container = document.createElement("div");
    container.classList.add("container");

    // Crear los inputs para editar la pelicula
    const form = document.createElement("form");
    form.id = "form_edit_pelicula";
    form.className = "form_edit_pelicula";

    // Crea el elemento de nombre de película
    var nombre = document.createElement("input");
    nombre.className = "form-control";
    nombre.placeholder = "Nombre de la pelicula";
    nombre.style.marginBottom = "10px"

    // Crea el elemento de año de película
    var generoPelicula = document.createElement("input");
    generoPelicula.className = "form-control";
    generoPelicula.placeholder = "Genero de la pelicula";
    generoPelicula.style.marginBottom = "10px"

    // Crea el elemento de año de película
    var clasiPelicula = document.createElement("input");
    clasiPelicula.className = "form-control";
    clasiPelicula.placeholder = "Clasificacion de la pelicula";
    clasiPelicula.style.marginBottom = "10px"

    // Crea el elemento de año de película
    var anioPelicula = document.createElement("input");
    anioPelicula.className = "form-control";
    anioPelicula.placeholder = "Año de la pelicula";
    anioPelicula.style.marginBottom = "10px"

    // Crea el elemento de año de película
    var duracionPelicula = document.createElement("input");
    duracionPelicula.className = "form-control";
    duracionPelicula.placeholder = "Duracion de la pelicula";
    duracionPelicula.style.marginBottom = "10px"

    // Crea el elemento de año de película
    var enlacePelicula = document.createElement("input");
    enlacePelicula.className = "form-control";
    enlacePelicula.placeholder = "Enlace de la pelicula";
    enlacePelicula.style.marginBottom = "10px"

    // Crea el elemento de año de película
    var botonEditar = document.createElement("button");
    botonEditar.className = "btn btn-primary";
    botonEditar.textContent = "Editar";

    // Agregar los elementos al formulario
    botonEditar.addEventListener("click", function(e){
        e.preventDefault();

        const data = {
            'nombre': nombre.value,
            'genero': generoPelicula.value,
            'anio': clasiPelicula.value,
            'clasificacion': anioPelicula.value,
            'duracion': duracionPelicula.value,
            'linkYouTube': enlacePelicula.value,
        }

        fetch(`http://127.0.0.1:5000//editPelicula/${nombrePelicula}`,{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(res =>{
                switch (res.message) {
                    case 'EmptyFields':{
                        alert("Por favor llene todos los campos")
                    } break;
                    case 'Succes':{
                        alert("Se edito la pelicula correctamente")
                    }   break;
                    default:{
                        alert("No se pudo generar la información.")
                    }  break;
                }
            }).catch(error => {
                console.error('Error:', error)
            });
    });

    // Agregar los inputs al formulario
    form.appendChild(nombre);
    form.appendChild(generoPelicula);
    form.appendChild(clasiPelicula);
    form.appendChild(anioPelicula);
    form.appendChild(duracionPelicula);
    form.appendChild(enlacePelicula);
    form.appendChild(botonEditar);

    // Agregar el formulario al contenedor
    container.appendChild(form);

    //Centrar el formulario en el modal
    container.style.margin = "auto";
    container.style.width = "80%";
    container.style.padding = "10px";


    const tbody_modal =  document.getElementById("modal_body_tabla")
    // Agregar la tabla generada al modal
    tbody_modal.appendChild(container);

    //Obtener los comentarios de la pelicula por medio de la api
    fetch(`http://127.0.0.1:5000//getPeliculas/`,{
    }).then(response => response.json())
        .then(res =>{
            switch (res.message) {
                case 'Succes':{
                    res.peliculas.forEach(pelicula => {
                        if(pelicula.nombre == nombrePelicula){
                            nombre.value = pelicula.nombre
                            generoPelicula.value = pelicula.genero
                            clasiPelicula.value = pelicula.clasificacion
                            anioPelicula.value = pelicula.anio
                            duracionPelicula.value = pelicula.duracion
                            enlacePelicula.value = pelicula.link

                        }
                    });
                    
                }   break;
                default:{
                    alert("No se pudo generar la información.")
                }  break;
            }
        }).catch(error => {
            console.error('Error:', error)
        });
}



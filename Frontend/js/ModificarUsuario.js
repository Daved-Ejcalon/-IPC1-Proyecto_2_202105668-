const btnModificar = document.getElementById('btnModificar');

const nombreInput = document.getElementById('nombreInput');
const apellidoInput = document.getElementById('apellidoInput');
const userInput = document.getElementById('userInput');
const inputPassword = document.getElementById('inputPassword');

const body = document.querySelector('body');

var userData = sessionStorage.getItem("user_data");

body.onload = () => {

    //Obtener usuario de session storage
    if (!userData) {
        console.log("Usuario no logeado");
        window.location.href = "Signin.html";
    }

    datosEnInput();
}


btnModificar.addEventListener('click', (e) => {
    e.preventDefault();

    var dataSessionStorage = JSON.parse(userData);
    var nombreUsuario = dataSessionStorage.nombreUsuario;
    
    const user = userInput.value;
    const password = inputPassword.value;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;

    const data = {
        'nombre': nombre,
        'apellido': apellido,
        'nombreusuario': user,
        'password': password
    }

    fetch(`http://127.0.0.1:5000//modificarUsuario/${nombreUsuario}`,{
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(res =>{
            switch (res.message) {
                case 'Succes':{
                    alert(`Se modificó al ${res.tipo} ${user}`)
                    
                    //Actualizar el session storage
                    sessionStorage.setItem("user_data", JSON.stringify( // Guardar datos en sessionStorage
                        {
                            'apellido': data.apellido,
                            'nombre': data.nombre,
                            'nombreUsuario': data.nombreusuario,
                            'password': data.password,
                            'tipo': res.tipo,
                        }
                    )) 

                    userInput.value = ''
                    inputPassword.value = ''
                    nombreInput.value = ''
                    apellidoInput.value = ''

                    if(res.tipo == "administrador"){
                        window.location.href = "AdminDashboard.html";
                    }else{
                        window.location.href = "ClientDashboard.html";
                    }
                }
                    break;
                default:{
                    alert("No se pudo modificar al usuario")
                    window.location.href = "Home.html";
                }
                    break;
            }
            
        }).catch(error => {
            console.error('Error:', error)
        });
});

function datosEnInput(){

    const dataSessionStorage = JSON.parse(userData);
    const nombreUsuario = dataSessionStorage.nombreUsuario;

    fetch(`http://127.0.0.1:5000//getUsuario/${nombreUsuario}`,{
    }).then(response => response.json())
        .then(res =>{
            switch (res.message) {
                case 'Succes':{
                    userInput.value = res.data.nombreUsuario
                    inputPassword.value = res.data.password
                    nombreInput.value = res.data.nombre
                    apellidoInput.value = res.data.apellido
                    
                    if(res.data.tipo == "administrador"){ //Si es administrador, se redirige a la pagina de administrador
                        document.getElementById("exit_user").addEventListener("click", function(){
                            sessionStorage.clear();
                            window.location.href = "AdminDashboard.html";
                        });
                    }else{
                        document.getElementById("exit_user").addEventListener("click", function(){
                            sessionStorage.clear();
                            window.location.href = "ClientDashboard.html";
                        });
                    }
                }   break;
                default:{
                    alert("No se encontro datos del usuario")
                }  break;
            }
            
        }).catch(error => {
            console.error('Error:', error)
        });
}
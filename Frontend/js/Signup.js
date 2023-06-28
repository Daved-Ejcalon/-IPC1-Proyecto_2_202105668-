const btnSignup = document.getElementById('btnSignUp');
const btnRegresarSignin = document.getElementById('btnRegresarSignin');

const nombreInput = document.getElementById('nombreInput');
const apellidoInput = document.getElementById('apellidoInput');
const userInput = document.getElementById('userInput');
const inputPassword = document.getElementById('inputPassword');

btnRegresarSignin.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "Signin.html";
});


btnSignup.addEventListener('click', (e) => {
    e.preventDefault();
    
    const user = userInput.value;
    const password = inputPassword.value;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;

    const data = {
        'tipo': 'cliente', // Se crea un cliente por defecto
        'nombre': nombre,
        'apellido': apellido,
        'usuario': user,
        'password': password
    }

    fetch(`http://127.0.0.1:5000//registro/`,{
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .catch(error => {
            console.error('Error:', error)
        }).then(res =>{
            switch (res.message) {
                case 'ClientExist':{
                    alert(`Ya existe el usuario ${user}, intenta con otro`)
                    userInput.value = ''
                }
                    break;
            
                case 'SuccesClient':{
                    alert(`Credenciales correctas, usuario ${user} registrado`)
                    userInput.value = ''
                    inputPassword.value = ''
                    nombreInput.value = ''
                    apellidoInput.value = ''
                    location.href = "Signin.html"//aqui deberia de ir a la pagina de los clientes
                }
                    break;
                default:{
                    alert("Datos incorrectos, intenta de nuevo")
                }
                    break;
            }
            
        })
});

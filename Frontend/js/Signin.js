const btnSignin = document.getElementById('btnSignin');
const btnForgotPassword = document.getElementById('btnForgotPassword');
const btnSignUp = document.getElementById('btnSignUp');

const userInput = document.getElementById('userInput');
const inputPassword = document.getElementById('inputPassword');


btnSignin.addEventListener('click', (e) => {
    e.preventDefault();

    const user = userInput.value;
    const password = inputPassword.value;

    const data = {
        'nombreusuario': user,
        'password': password
    }

    fetch(`http://127.0.0.1:5000//login/`,{
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
                case 'SuccesAdmin':{
                    alert(`Credenciales correctas, bienvenido ${user}`)
                    sessionStorage.setItem("user_data", JSON.stringify(res.data)) // Guardar datos en sessionStorage

                    location.href = "AdminDashboard.html"//aqui deberia de ir a la pagina de los clientes
                }
                    break;
                case 'SuccesClient':{
                    alert(`Credenciales correctas, bienvenido ${user}`)
                    sessionStorage.setItem("user_data", JSON.stringify(res.data)) // Guardar datos en sessionStorage

                    location.href = "ClientDashboard.html"//aqui deberia de ir a la pagina de los clientes
                }
                    break;
                case 'WrongPassword':{
                    alert(`Contraseña incorrecta`)
                }
                    break;
                default:{
                    alert("Usuario no registrado")
                }
                    break;
            }
            
        })

});

btnForgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "ForgotPassword.html";
});

btnSignUp.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "Signup.html";
});
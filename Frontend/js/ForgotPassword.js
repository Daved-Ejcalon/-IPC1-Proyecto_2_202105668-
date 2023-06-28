const btnRecuperar = document.getElementById('btnRecuperar');
const userInput = document.getElementById('userInput');
const btnRegresarSignin = document.getElementById('btnRegresarSignin');

const body = document.querySelector('body');

btnRegresarSignin.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "Signin.html";
});

btnRecuperar.addEventListener('click', (e) => {
    e.preventDefault();

    const user = userInput.value;

    fetch(`http://127.0.0.1:5000//recuperarPassword/${user}`,{
    }).then(response => response.json())
        .then(res =>{
            if(res.message == "Succes"){
                const passwordRecuperada = res.password;
                alert(`Su contraseña es ${passwordRecuperada}`)
                //window.location.href = "Signin.html";
                return;
            }
            //Si no se encuentra el usuario
            alert("Usuario no registrado")
            
        }).catch(error => {
            console.error('Error:', error)
        });
        

});

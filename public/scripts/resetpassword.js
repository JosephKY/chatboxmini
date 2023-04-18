let usernameOrEmail = document.getElementById("usernameOrEmail")
let submit = document.getElementById("resetPasswordSubmit")

function valInput(){
    if(usernameOrEmail.value.length > 0){
        submit.disabled = false;
        return;
    }
    submit.disabled = true
}

valInput()

usernameOrEmail.oninput = ()=>{
    valInput()
}

async function app(){
    if(me != null)window.location.href = "/"
}
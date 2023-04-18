let params = new URLSearchParams(window.location.search)
let token = params.get("token")
if(token != undefined){
    document.getElementById("recoveryMain").classList.add("hidden")
    document.getElementById("recoveryFinal").classList.remove("hidden")
}

let usernameOrEmail = document.getElementById("usernameOrEmail")
let submit = document.getElementById("resetPasswordSubmit")

let newPass = document.getElementById("resetPasswordNew")
let newPassVerify = document.getElementById("resetPasswordNewVerify")
let newPassSubmit = document.getElementById("resetPasswordSubmitNew")

function valNewInput(){
    if(newPass.value.length >= 8 && newPass.value == newPassVerify.value){
        newPassSubmit.disabled = false;
    } else {
        newPassSubmit.disabled = true
    }
}

[newPass, newPassVerify].forEach(np=>{
    np.oninput = ()=>{
        valNewInput()
    }
})

newPassSubmit.onclick = async ()=>{
    [newPass, newPassSubmit, newPassVerify].forEach(v=>{v.disabled = true})
    let res = (await ajax({
        "url":"/api/users/setpassword",
        "data":{
            token: token,
            newPassword: newPass.value
        },
        "method":"GET"
    }))

    if(res != undefined && res.type == 'error'){
        notification(res.data, 5000)
        [newPass, newPassSubmit, newPassVerify].forEach(v=>{v.disabled = false})
    } else {
        document.getElementById("recoveryFinal").classList.add("hidden")
        document.getElementById("recoveryComplete").classList.remove("hidden")
    }


}

document.getElementById("blowThisPopsicleStand").onclick = ()=>{window.location.href = "/login"}

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

submit.onclick = async ()=>{
    usernameOrEmail.disabled = true
    submit.disabled = true

    let res = (await ajax({
        "url":"/api/users/resetpassword",
        "data":{
            usernameOrEmail:usernameOrEmail.value
        },
        "type":"GET",
        "async":true
    }))
    if(res != undefined && res.type == 'error'){
        notification("That didn't work. Please try again later", 5000) 
        usernameOrEmail.disabled = false;
        submit.disabled = false;
    } else {
        document.getElementById("recoveryMain").classList.add("hidden")
        document.getElementById("recoverySubmitted").classList.remove("hidden")
    }

    

}

async function app(){
    if(me != null)window.location.href = "/"
}
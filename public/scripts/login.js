// Login elements
let loginUsernameOrEmail = document.getElementById("loginUsernameOrEmail")
let loginPassword = document.getElementById("loginPassword")
let loginSubmit = document.getElementById("loginSubmit")

// Singup elements
let signupUsername = document.getElementById("signupUsername")
let signupEmail = document.getElementById("signupEmail")
let signupDob = document.getElementById("signupDob")
let signupPassword = document.getElementById("signupPassword")
let signupAgreement = document.getElementById("signupAgreement")
let signupSubmit = document.getElementById("signupSubmit")

let userConfig = {
    minUsernameLength: 3,
    maxUsernameLength: 32,
    minPasswordLength: 8,
    maxPasswordLength: 128
};

function isEmpty(el){
    if(!el.value.trim())return true;
    return false
}

function usernameValidate(username){
    var regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
}

function valEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function evalLogin(){
    if(
        isEmpty(loginUsernameOrEmail) ||
        isEmpty(loginPassword)
    )return false;
    return true;
}

function minAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // If the user's birth month and day have not happened yet this year
    // and they haven't turned the minimum age yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 13;
}

function checkLogin(){
    if(evalLogin()){
        loginSubmit.disabled = false;
    } else {
        loginSubmit.disabled = true;
    }
}

[loginUsernameOrEmail, loginPassword].forEach(el=>{
    el.addEventListener("input", ()=>{
        checkLogin()
    })
})

function evalSignup(){
    if(
        isEmpty(signupUsername) ||
        isEmpty(signupEmail) ||
        isEmpty(signupPassword) ||
        signupAgreement.checked == false ||
        signupDob.valueAsNumber == null
    )return false;
    return true;
}

function checkSignup(){
    if(evalSignup()){
        signupSubmit.disabled = false;
    } else {
        signupSubmit.disabled = true;
    }
}

[signupUsername, signupEmail, signupDob, signupPassword, signupAgreement].forEach(el=>{
    el.addEventListener("input", ()=>{
        checkSignup()
    })
})

signupSubmit.onclick = ()=>{
    if(!minAge(signupDob.value)){
        notification("Sorry, but you must be at least 13 years old to sign up", 5000);
        return;
    }

    if(!valEmail(signupEmail.value)){
        notification("Please enter a valid email address", 5000);
        return;
    }

    if(!usernameValidate(signupUsername.value)){
        notification("Username can only contain alphanumeric characters", 5000);
        return;
    }

    if(signupUsername.value.length < userConfig.minUsernameLength || signupUsername.value.length > userConfig.maxUsernameLength){
        notification(`Username must be between ${userConfig.minUsernameLength} and ${userConfig.maxUsernameLength} characters`, 5000);
        return;
    }

    if(signupPassword.value.length < userConfig.minPasswordLength || signupPassword.value.length > userConfig.maxPasswordLength){
        notification(`Password must be between ${userConfig.minPasswordLength} and ${userConfig.maxPasswordLength} characters`, 5000);
        return;
    }
}

loginSubmit.onclick = async ()=>{
    let res = (await ajax({
        "url":"/api/users/login",
        "data":{
            "usernameOrEmail":loginUsernameOrEmail.value,
            "password":loginPassword.value
        },
        "method":"GET"
    }))
    console.log(res)
    if(res.type == "error"){
        notification(res.data, 5000);
    } else {
        window.location.href = "/"
    }
}


async function app(){
    checkLogin()
    checkSignup()

    if(me != null)window.location.href = "/"
}
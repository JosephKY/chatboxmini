function setStatus(content){
    document.getElementById("returnStatus").innerHTML = content
}

let params = new URLSearchParams(window.location.search)
let token = params.get("token")

setStatus("Loading...")

async function app(){
    if(me == null || me.emailverified == 1){
        window.location.href = "/"
    }

    if(token == undefined){
        setStatus("Token missing. This link may be old or invalid, try requesting a new verification email")
    }

    let res = (await ajax({
        url:"/api/users/verify",
        data:{
            token:token
        },
        type:"GET"
    }))

    if(!res){
        setStatus("Something went wrong. Please try again later")
        return
    }

    if(res.type == 'error'){
        setStatus(res.data)
        return
    }

    console.log(res.type)

    setStatus("Email verified successfully! Your account is now more secure and you can create posts")
}
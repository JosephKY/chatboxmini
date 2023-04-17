let profileHeader = document.getElementById("profileHeader")



async function app(){
    let userid = window.location.pathname.split("/")[2]
    let user = (await getUser(userid))

    if(!user){
        profileHeader.innerHTML = "Unknown"
        return
    }

    profileHeader.innerHTML = user.username

    if(user.verified == 1){
        let verTick = document.getElementById("verifiedTick")
        verTick.classList.remove("hidden")
        verTick.addEventListener("click", ()=>{
            alert("This user's identity has been verified")
        })
    }

    let userCreated = new Date(user.created * 1000);
    document.getElementById("userInfoJoined").innerHTML = `Joined ${userCreated.toLocaleDateString()}`

    let userFeed = new Feed(document.getElementById("userContent"), "user")
    userFeed.load({
        "max":15,
        "userid":userid
    })

    console.log(user)
}
let profileHeader = document.getElementById("profileHeader")

async function app(){
    let userid = window.location.pathname.split("/")[1]
    let user = (await getUser(userid))

    if(!user){
        profileHeader.innerHTML = "Unknown"
        return
    }

    if(user.suspended == 1){
        profileHeader.innerHTML = "Account Suspended"
        return
    }

    if(user.actions != undefined && user.actions.length > 0){
        let userMenu = document.createElement("img")
        userMenu.classList.add("userMenu")
        userMenu.src = "/assets/menumono.png"
        document.getElementById("profileHeaderContainer").appendChild(userMenu)

        userMenu.addEventListener("click", ev=>{
            let usercx = new ContextMenu(ev.clientX, ev.clientY)
            user.actions.forEach(action=>{
                switch (action){
                    case "report":
                        usercx.add(
                            "Report", 
                            ()=>{
                                window.location.href = `/report?target=${user.id}&type=user&hint=${encodeURIComponent(user.username)}`
                            },
                            "/assets/report.png",
                        )
                        break
                }
            })

            usercx.show()
        })
        
    }

    profileHeader.innerHTML = user.username

    if(user.verified == 1){
        let verTick = document.getElementById("verifiedTick")
        verTick.classList.remove("hidden")
        verTick.addEventListener("click", ()=>{
            alert("This user is notable due to government affiliation, press affiliation, company representation, or for another reason and their identity has been verified")
        })
    }

    let userCreated = new Date(user.created * 1000);
    document.getElementById("userInfoJoined").innerHTML = `Joined ${userCreated.toLocaleDateString()}`

    let userFeed = new Feed(document.getElementById("userContent"), "user")
    userFeed.load({
        "max":15,
        "userid":user.id
    })

    userFeed.onEndScroll = ()=>{
        userFeed.load({
            "max":15,
            "userid":user.id,
            "startingId":userFeed.lastPostId
        })
    }

}
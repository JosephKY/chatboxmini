let profileHeader = document.getElementById("profileHeader")

async function app(){
    let userid = window.location.pathname.split("/")[2]
    let user = (await ajax({
        "type":"GET",
        "url":`/api/users/${userid}`,
        "dataType":"json"
    }))

    if(user.type == "error"){
        profileHeader.innerHTML = "Unknown"
        return
    }

    let userData = user.data
    profileHeader.innerHTML = userData.username
    console.log(user)
}
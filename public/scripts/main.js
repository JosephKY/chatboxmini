let notifElement = document.getElementById("notification")
let lastNotifCall = 0

function ajax(params) {
    return new Promise(function (resolve, reject) {
        let final = Object.assign({
            success: function (response) {
                resolve(response);
            },
            error: function (error) {
                if(error.responseJSON){
                    resolve(error.responseJSON)
                } else {
                    reject(error);
                }
            }
        }, params)
        $.ajax(final);
    });
}

function notification(content, duration = 0) {
    let now = Date.now()
    lastNotifCall = now
    notifElement.innerHTML = content
    notifElement.classList.add("visible")
    if (duration > 0) {
        setTimeout(() => {
            if (lastNotifCall != now) return
            notifElement.classList.remove("visible")
        }, duration)
    }
}

notifElement.addEventListener("click", () => {
    notifElement.classList.remove("visible")
})

let me;

async function main(){
    me = (await ajax({"url":"/api/users/me","method":"GET"})).data

    if(me != null){
        document.getElementById("profileDetails").classList.remove("hidden")
        document.getElementById("signin").classList.add("hidden")
        document.getElementById("welcomeMsg").innerHTML = document.getElementById("welcomeMsg").innerHTML.replace("%username%", me.username)
    }

    try {
        app()
    } catch(err){
        console.log("No App")
    }
    
}

main()

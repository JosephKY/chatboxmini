let notifElement = document.getElementById("notification")
let lastNotifCall = 0

let cache = {}

function setCache(title, key, object){
    if(cache[title] == undefined){
        cache[title] = {}
    }
    cache[title][key] = object
}

function getCache(title, key){
    if(cache[title] == undefined || cache[title][key] == undefined)return false;
    let ret = cache[title][key];
    if(ret.constructor != undefined){
        ret = Object.assign({}, ret)
    }
    return ret
}

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

async function getUser(userid){
    let c = getCache("user", userid);
    if(c != false)return c;

    let user = (await ajax({
        "type":"GET",
        "url":`/api/users/${userid}`
    }))

    if(user.type == 'error')return false;

    setCache('user', userid, user.data)
    return user.data;
}

function notification(content, duration = 0, bgcolor="#d02525") {
    let now = Date.now()
    lastNotifCall = now
    notifElement.innerHTML = content
    notifElement.classList.add("visible")
    notifElement.style.backgroundColor = bgcolor
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

class Feed {
    constructor(containingElement, type){
        this.container = document.createElement("div")
        this.container.classList.add("feedContainer")
        containingElement.appendChild(this.container)

        this.noload = false;

        this.type = type
    }

    async load(params){
        if(this.noload)return;
        let load = (await ajax({
            "url":`/api/posts/feed/${this.type}`,
            "type":"GET",
            "data":params
        }))

        if(load.type == 'error')return;

        let posts = load.data;
        posts.forEach(async post=>{
            if(post.restrictions.length > 0)return;

            let postUser = (await getUser(post.userid));
            if(!postUser)return;

            let postElement = document.createElement("div")
            postElement.classList.add("feedPost")

            let postInfoElement = document.createElement("div")
            postInfoElement.classList.add("feedPostInfo")
            postElement.appendChild(postInfoElement)

            let postUsernameElement = document.createElement("span")
            postUsernameElement.innerHTML = postUser.username;
            postUsernameElement.classList.add("feedPostUsername")
            postInfoElement.appendChild(postUsernameElement)

            let postCreatedElement = document.createElement("span")
            postCreatedElement.innerHTML = (new Date(post.created)).toDateString();
            postCreatedElement.classList.add("feedPostCreated")
            postInfoElement.appendChild(postCreatedElement)

            let postContent = document.createElement("p")
            postContent.innerHTML = post.content
            postContent.classList.add('feedPostContent')
            postElement.appendChild(postContent)

            this.container.appendChild(postElement)
            console.log(post)
        })
        //console.log(load)
    }
}

async function main(){
    me = (await ajax({"url":"/api/users/me","method":"GET"})).data

    if(me != null){
        document.getElementById("profileDetails").classList.remove("hidden")
        document.getElementById("signin").classList.add("hidden")
        document.getElementById("myprofileLink").innerHTML = document.getElementById("myprofileLink").innerHTML.replace("%username%", me.username)
        document.getElementById("myprofileLink").href = `/users/${me.id}`
    }

    try {
        app()
    } catch(err){
        console.log("No App")
    }
    
}

main()

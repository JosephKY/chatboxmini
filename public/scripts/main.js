console.log(
    "%c🛑 STOP NOW! 🛑",
    "color: red;font-family: font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;font-size:8em"
)

console.log("%cThe console is a tool intended for developers. Anything you input into this console may risk your account being STOLEN and your personal information COMPROMISED. If anyone told you to input something into this console, THEY ARE LIKELY ATTEMPTING TO SCAM YOU. Do NOT input anything into this console that you don't understand or share any browser cookies!", "background: yellow; color: black; font-size: 2em; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;")
console.log("%cThere is nothing beyond this point worth risking your account over!", "background: red; color: white; font-size: 2em; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;")


let notifElement = document.getElementById("notification")
let lastNotifCall = 0

let cache = {}
let availableLocales = [
    "en-US",
    "zh-CN",
    "ru-RU",
    "fr-FR",
    "es-ES",
    "en-GB",
    "de-DE",
    "pt-BR",
    "en-CA",
    "es-MX",
    "it-IT",
    "ja-JP"
]

let userlocale = getCookie("locale")
if (!userlocale || !availableLocales.includes(userlocale)) {
    userlocale = 'en-US';
}

let green = "rgb(57, 155, 91)"

// Function to get the value of a cookie by its name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Function to set a cookie with a name, value, and optional options
function setCookie(name, value, options = {}) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (options.expires) {
        const expires = options.expires.toUTCString();
        cookie += `; expires=${expires}`;
    }
    if (options.path) {
        cookie += `; path=${options.path}`;
    }
    if (options.domain) {
        cookie += `; domain=${options.domain}`;
    }
    if (options.secure) {
        cookie += '; secure';
    }
    document.cookie = cookie;
}

// Function to delete a cookie by its name
function deleteCookie(name) {
    setCookie(name, '', { expires: new Date(0) });
}

if(getCookie('cookieagreement') == null){
    document.getElementById("cookienoticecontainer").classList.remove("hidden")
}


function setCache(title, key, object) {
    if (cache[title] == undefined) {
        cache[title] = {}
    }
    cache[title][key] = object
}

function getCache(title, key) {
    if (cache[title] == undefined || cache[title][key] == undefined) return false;
    let ret = cache[title][key];
    if (ret.constructor != undefined) {
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
                if (error.responseJSON) {
                    resolve(error.responseJSON)
                } else {
                    reject(error);
                }
            }
        }, params)
        $.ajax(final);
    });
}

async function getUser(userid) {
    let c = getCache("user", userid);
    if (c != false) return c;

    let user = (await ajax({
        "type": "GET",
        "url": `/api/users/${userid}`
    }))

    if (user.type == 'error') return false;

    setCache('user', userid, user.data)
    return user.data;
}

function notification(content, duration = 0, bgcolor = "#d02525") {
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

class ContextMenu {
    constructor(x, y) {
        let master = document.createElement("div")
        master.classList.add("contextMenuMaster")
        master.classList.add("hidden")
        document.body.appendChild(master)
        master.addEventListener("click", () => {
            this.delete()
        })
        this.master = master

        let container = document.createElement("div")
        container.classList.add("contextMenuContainer")
        container.style.top = `${y}px`
        container.style.left = `${x}px`
        master.appendChild(container)
        this.container = container

        this.itemElements = []
        return this
    }

    show() {
        this.master.classList.remove("hidden")
        return this
    }

    delete() {
        this.master.remove()
    }

    hide() {
        this.master.classList.add("hidden")
        return this
    }

    add(name, onclick, icon = "/assets/action.png", selfDestruct = true) {
        let itemElement = document.createElement("div")
        itemElement.classList.add("contextMenuItem")
        itemElement.addEventListener("click", () => {
            onclick()
            if (selfDestruct) {
                this.delete()
            }
        })
        this.itemElements.push(itemElement)
        this.container.appendChild(itemElement)

        let itemElementIcon = document.createElement("img")
        itemElementIcon.src = icon
        itemElementIcon.classList.add("contextMenuItemIcon")
        itemElement.appendChild(itemElementIcon)

        let itemElementName = document.createElement("span")
        itemElementName.innerHTML = name
        itemElementName.classList.add("contextMenuItemName")
        itemElement.appendChild(itemElementName)
        return this;
    }


}

class Feed {
    constructor(containingElement, type, onEndScroll) {
        this.container = document.createElement("div")
        this.container.classList.add("feedContainer")
        containingElement.appendChild(this.container)

        this.noload = false;
        this.onEndScroll = onEndScroll
        this.lastPostId = 0;

        document.body.onscroll = () => {
            if (window.scrollY >= (window.scrollMaxY - 50)) {
                try {
                    console.log("fire")
                    this.onEndScroll()
                } catch (err) {

                }
            }
        }

        this.type = type
    }

    feederr(details){
        let errElement = document.createElement("p")
        errElement.classList.add("feedErrorInfo")
        errElement.innerHTML = details
        this.container.appendChild(errElement)
        this.noload = true
    }

    async load(params) {
        let prevBodySroll = window.scrollMaxY
        if (this.noload){
            return
        }
        this.noload = true
        let load = (await ajax({
            "url": `/api/posts/feed/${this.type}`,
            "type": "GET",
            "data": params
        }))

        if (!load || load.type == 'error'){
            this.feederr("Something went wrong")
            return
        };

        let posts = load.data;

        if (posts.length == 0){
            this.feederr("No posts remaining")
            return;
        }

        this.lastPostId = posts[posts.length - 1].id

        for (let post of posts) {
            if (post.deleted == 1) {
                continue
            }

            let postUser = (await getUser(post.userid));
            if (!postUser) {
                continue;
            }

            let postElement = document.createElement("div")
            postElement.classList.add("feedPost")

            let postInfoElement = document.createElement("div")
            postInfoElement.classList.add("feedPostInfo")
            postElement.appendChild(postInfoElement)

            let postUsernameElement = document.createElement("span")
            postUsernameElement.innerHTML = postUser.username;
            postUsernameElement.classList.add("feedPostUsername")
            postUsernameElement.addEventListener("click", () => {
                window.location.href = `/${postUser.username}`
            })
            postInfoElement.appendChild(postUsernameElement)

            if (postUser.verified == 1) {
                let postVerifiedTickElement = document.createElement("img")
                postVerifiedTickElement.src = '/assets/verified.png'
                postVerifiedTickElement.classList.add("feedPostVerifiedTick")
                postInfoElement.appendChild(postVerifiedTickElement)
            }

            let postCreatedElement = document.createElement("span")
            postCreatedElement.innerHTML = (new Date(post.created * 1000)).toLocaleString(userlocale)
            postCreatedElement.classList.add("feedPostCreated")
            postInfoElement.appendChild(postCreatedElement)

            if (post.actions != undefined && post.actions.length > 0) {
                let postOptions = document.createElement("img")
                postOptions.classList.add("feedPostOptions")
                postOptions.addEventListener("click", ev => {
                    let cx = new ContextMenu(ev.clientX, ev.clientY)
                    post.actions.forEach(action => {
                        switch (action) {
                            case "delete":
                                cx.add(
                                    "Delete",
                                    async () => {
                                        let res = (await ajax({
                                            "url": `/api/posts/delete/${post.id}`,
                                            "type": "GET"
                                        }));
                                        console.log(res)
                                        if (res == undefined || res.type == 'error') {
                                            notification("Something went wrong. Please try again later", 5000)
                                            return
                                        }
                                        postElement.remove()
                                        notification("Post deleted", 3000)
                                    },
                                    "/assets/delete.png"
                                )
                                break
                            case "report":
                                cx.add(
                                    "Report",
                                    () => {
                                        window.location.href = `/report?target=${post.id}&type=post&hint=${encodeURIComponent(post.content)}`
                                    },
                                    "/assets/report.png"
                                )
                                break
                        }
                    })

                    cx.show()
                })
                postOptions.src = "/assets/menumono.png"
                postInfoElement.appendChild(postOptions)
            }



            /*
            let postContent = document.createElement("textarea")
            postContent.innerHTML = post.content
            postContent.classList.add('feedPostContent')
            postContent.style.height = `calc(${postContent.scrollHeight}px + 1.2em)`
            postContent.readOnly = true
            postElement.appendChild(postContent)
            */

            class TextFormat {
                constructor(token, htmlElementName) {

                }
            }

            let postContent = document.createElement("div")
            postContent.classList.add('feedPostContent')
            let content = String(post.content)
            let lines = (content.split(/\r?\n|\r|\n/g));
            //let boldActivated = false;
            for (let lineIndex in lines) {
                let line = lines[lineIndex]
                let splt = line.split(" ")
                for (let wordIndex in splt) { // Implementation
                    let word = splt[wordIndex]
                    if (!word) continue

                    /*
                    let formatSplit = word.split("[b]")
                    if(formatSplit.length > 1){
                        let special = formatSplit[0]
                        if(!special != true){
                            let specialElement = document.createElement("span")
                            specialElement.innerHTML = special
                            postContent.appendChild(specialElement)
                        }
                        
                        boldActivated = true
                    }

                    let deformatSplit = word.split("[/b]")
                    if(deformatSplit.length > 1){
                        boldActivated = false
                    }*/

                    let wordElement = document.createElement("span")
                    wordElement.innerHTML = `${word}`
                    postContent.appendChild(wordElement)
                    if (wordIndex != (splt.length - 1)) {
                        let spaceElement = document.createElement("span")
                        spaceElement.innerHTML = " "
                        postContent.appendChild(spaceElement)
                    }

                    /*
                    if(boldActivated){
                        wordElement.innerHTML = `<b>${word}</b>`
                    }
                    */
                }
                if (lineIndex != (lines.length - 1)) {
                    let breakElement = document.createElement("br")
                    postContent.appendChild(breakElement)
                }
            }


            postElement.appendChild(postContent)


            if (post.restrictions.length > 0) {
                let nohide = undefined;

                postContent.classList.add("hidden")

                let postRestrictionContainer = document.createElement("div")
                postRestrictionContainer.classList.add("postRestrictionContainer")
                postElement.appendChild(postRestrictionContainer)

                let postRestrictionFlairContainer = document.createElement("div")
                postRestrictionFlairContainer.classList.add("postRestrictionFlairContainer")
                postRestrictionContainer.appendChild(postRestrictionFlairContainer)

                let postRestrictionFlairIcon = document.createElement("img")
                postRestrictionFlairIcon.src = "/assets/warningmono.png"
                postRestrictionFlairIcon.classList.add("postRestrictionFlairIcon")
                postRestrictionFlairContainer.appendChild(postRestrictionFlairIcon)

                let postRestrictionFlair = document.createElement("span")
                postRestrictionFlair.innerHTML = "Content Restricted"
                postRestrictionFlair.classList.add("postRestrictionFlair")
                postRestrictionFlairContainer.appendChild(postRestrictionFlair)

                let postRestrictionContent = document.createElement("p")
                postRestrictionContent.classList.add("postRestrictionContent")
                postRestrictionContainer.appendChild(postRestrictionContent)

                let postRestrictionShow = document.createElement("button")
                postRestrictionShow.innerHTML = "Show Content"
                postRestrictionShow.onclick = () => {
                    postRestrictionContainer.classList.add("hidden")
                    postContent.classList.remove("hidden")
                }
                postRestrictionShow.classList.add("postRestrictionShow")
                postRestrictionShow.classList.add("button")
                postRestrictionContainer.appendChild(postRestrictionShow)

                for (let restriction of post.restrictions) {
                    if (restriction.hidecontent == 1) {
                        postRestrictionContent.innerHTML = restriction.reason;
                        postRestrictionShow.remove()
                        break
                    } else {
                        if (nohide == undefined) {
                            nohide = restriction
                            postRestrictionContent.innerHTML = restriction.reason
                        }
                    }
                }
            }


            this.container.appendChild(postElement)
        }

        
        this.noload = false;
        if(window.scrollMaxY == prevBodySroll){
            this.onEndScroll()
        }
    }
}

class ViewPage {
    constructor(source, container) {
        this.source = source;
        this.sourceContent = false;
        this.container = container
    }

    async load() {
        this.container.innerHTML = ""
        let loadingAjax = document.createElement("img")
        loadingAjax.src = "/assets/loading.gif"
        loadingAjax.classList = "pageLoading"
        this.container.appendChild(loadingAjax)

        if (this.sourceContent == false) {
            console.log('loading')
            let content = await ajax({
                "url": this.source,
                "type": "GET"
            })
            console.log(content)
            this.sourceContent = content;
        }

        loadingAjax.remove()
        this.container.innerHTML = this.sourceContent;

        if (this.onpageload != undefined) this.onpageload()
    }

    onload(method) {
        this.onpageload = method
        return this
    }
}

class ViewCategory {
    constructor(name, item, icon = undefined) {
        this.name = name
        this.item = item
        this.icon = icon
        return this;
    }

    onclick(method) {
        this.onclick = method
        return this;
    }

    run() {
        if (this.onclick != undefined) {
            this.onclick()
        }
    }
}

class ViewDirectory {
    constructor() {
        this.categories = [];
        return this;
    }

    addCategory(category) {
        this.categories.push(category);
        return this;
    }
}

class Views {
    constructor(masterElement, masterDirectory) {
        this.master = masterElement
        this.directories = [masterDirectory]
        this.currentDirectory = masterDirectory;
        this.masterDirectory = masterDirectory;

        this.render()
    }

    render() {
        while (this.master.firstChild) {
            this.master.removeChild(this.master.firstChild)
        }

        console.log(this.directories)
        if (this.directories.length > 1) {
            let backElement = document.createElement("div")
            backElement.classList.add("settingsElement")

            let backElementIcon = document.createElement("img")
            backElementIcon.src = "/assets/back.png"
            backElement.appendChild(backElementIcon)

            let backElementName = document.createElement("span")
            backElementName.innerHTML = "<b>Back</b>"
            backElement.appendChild(backElementName)

            backElement.addEventListener("click", () => {
                this.directories.pop()
                this.currentDirectory = this.directories[this.directories.length - 1]
                this.render()
            })

            this.master.appendChild(backElement)
        }

        this.currentDirectory.categories.forEach(category => {
            let categoryElement = document.createElement("div")
            categoryElement.classList.add("settingsElement")

            if (category.icon != undefined) {
                let categoryElementIcon = document.createElement("img")
                categoryElementIcon.src = category.icon
                categoryElement.appendChild(categoryElementIcon)
            }

            let categoryElementName = document.createElement("span")
            categoryElementName.innerHTML = category.name
            categoryElement.appendChild(categoryElementName)

            categoryElement.addEventListener("click", () => {
                if (category.item != undefined && category.item.constructor != undefined) {
                    switch (category.item.constructor.name) {
                        case "ViewPage":
                            category.item.load()
                            break
                        case "ViewDirectory":
                            this.directories.push(category.item)
                            this.currentDirectory = category.item;
                            this.render()
                            break
                    }
                }

                category.run()
            })

            this.master.appendChild(categoryElement)
        })


    }
}

function isEmpty(el) {
    if (!el.value.trim()) return true;
    return false
}

async function usernameValidate(username) {
    username = String(username)
    // Check if the string only contains alphanumeric characters
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return false;
    }

    // Check if the string contains at least one alphabetical character
    if (!/[a-zA-Z]/.test(username)) {
        return false;
    }

    // Check if the string has no spaces or special characters
    if (/\W|_/.test(username)) {
        return false;
    }

    return true;
}

function valEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function valPass(pass, verify) {
    if (pass.length < 8) {
        return -1;
    }

    if (pass.length > 128) {
        return -2;
    }

    if (pass != verify) {
        return -3
    }

    return true
}

let composeContainer = document.getElementById("composeContainer")
let composeContents = document.getElementById("composeContents")
let composeSubmit = document.getElementById("composeSend")
let composeChars = document.getElementById("composeChars")
let composeMax = 256

function composeInput() {
    if (composeContents.value.length > composeMax || composeContents.value.trim().length == 0) {
        composeSubmit.disabled = true
    } else {
        composeSubmit.disabled = false
    }

    composeChars.innerHTML = `${composeContents.value.length} / ${composeMax}`
    if (composeContents.value.length > composeMax) {
        composeChars.classList.add("maxReached")
    } else {
        composeChars.classList.remove("maxReached")
    }
}

function composeHide() {
    composeContainer.classList.add("hidden")
    composeContents.value = ""
}

$("#composeContainer").on('click', e => {
    if (e.target !== composeContainer) return
    composeHide()
})

function compose() {
    composeContainer.classList.remove("hidden")
}

async function composeCreate() {
    [composeContents, composeSubmit].forEach(i => { i.disabled = true });
    let res = (await ajax({
        url: "/api/posts/create",
        data: {
            content: composeContents.value
        },
        type: "POST"
    }))

    if (!res) {
        notification("Something went wrong. Please try again later!", 5000);
        [composeContents, composeSubmit].forEach(i => { i.disabled = false });
    }

    if (res.type == 'error') {
        notification(res.data, 5000);
        [composeContents, composeSubmit].forEach(i => { i.disabled = false });
    }

    composeHide()
    notification("Post created successfully", 3000, green)
}

async function bigerror(code){
    document.getElementById("catostrophicerrorcode").innerHTML = code
    document.getElementById("catostrophicerror").classList.remove("hidden")
}

async function main() {
    try {
        me = (await ajax({ "url": "/api/users/me", "method": "GET" }))

        if (me.type == 'error') {
            throw `AUTHFAILED-${me.code}`;
        }

        me = me.data

        if (me != null) {
            document.getElementById("newPostContainer").classList.remove("hidden")
            document.getElementById("profileDetails").classList.remove("hidden")
            document.getElementById("signin").classList.add("hidden")
            document.getElementById("myprofileLink").innerHTML = document.getElementById("myprofileLink").innerHTML.replace("%username%", me.username)
            document.getElementById("myprofileLink").href = `/${me.username}`
        }

        try {
            app()
        } catch (err) {
            console.log("No App")
        }
    } catch (err) {
        bigerror(err)
    }

}

main()

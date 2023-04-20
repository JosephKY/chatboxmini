let notifElement = document.getElementById("notification")
let lastNotifCall = 0

let cache = {}

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
                    this.onEndScroll()
                } catch (err) {

                }
            }
        }

        this.type = type
    }

    async load(params) {
        if (this.noload) return;
        this.noload = true
        let load = (await ajax({
            "url": `/api/posts/feed/${this.type}`,
            "type": "GET",
            "data": params
        }))

        if (load.type == 'error') return;

        let posts = load.data;

        if (posts.length == 0) return

        this.lastPostId = posts[posts.length - 1].id

        posts.forEach(async post => {
            if (post.deleted == 1) {
                console.log("DELETED")
                return
            }

            let postUser = (await getUser(post.userid));
            if (!postUser) {
                console.log("NO USER")
                return;
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
                window.location.href = `/users/${post.userid}`
            })
            postInfoElement.appendChild(postUsernameElement)

            if (postUser.verified == 1) {
                let postVerifiedTickElement = document.createElement("img")
                postVerifiedTickElement.src = '/assets/verified.png'
                postVerifiedTickElement.classList.add("feedPostVerifiedTick")
                postInfoElement.appendChild(postVerifiedTickElement)
            }

            let postCreatedElement = document.createElement("span")
            postCreatedElement.innerHTML = (new Date(post.created * 1000)).toDateString();
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
        })

        this.noload = false;
    }
}

class ViewPage {
    constructor(source, container) {
        this.source = source;
        this.sourceContent = false;
        this.container = container
    }

    async load() {
        if (this.sourceContent == false) {
            console.log('loading')
            let content = await ajax({
                "url": this.source,
                "type": "GET"
            })
            console.log(content)
            this.sourceContent = content;
        }

        console.log(this.sourceContent)
        this.container.innerHTML = this.sourceContent;

    }
}

class ViewCategory {
    constructor(name, item) {
        this.name = name
        this.item = item
        return this;
    }

    onclick(method){
        this.onclick = method
        return this;
    }

    run(){
        if(this.onclick != undefined){
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
        if(this.directories.length > 1){
            let backElement = document.createElement("div")
            backElement.classList.add("settingsElement")

            let backElementName = document.createElement("span")
            backElementName.innerHTML = "Back"
            backElement.appendChild(backElementName)

            backElement.addEventListener("click", ()=>{
                this.directories.pop()
                this.currentDirectory = this.directories[this.directories.length - 1]
                this.render()
            })

            this.master.appendChild(backElement)
        }

        this.currentDirectory.categories.forEach(category => {
            let categoryElement = document.createElement("div")
            categoryElement.classList.add("settingsElement")

            let categoryElementName = document.createElement("span")
            categoryElementName.innerHTML = category.name
            categoryElement.appendChild(categoryElementName)

            categoryElement.addEventListener("click", () => {
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

                category.run()
            })

            this.master.appendChild(categoryElement)
        })


    }
}

let mainContainer = document.getElementById("settingsContainer")
let mainPage = document.getElementById("settingsPage")

let homeDirectory = new ViewDirectory()
    .addCategory(
        new ViewCategory(
            "My Account",
            new ViewDirectory()
            .addCategory(
                new ViewCategory(
                    "Change Username",
                    new ViewPage("/", mainPage)
                )
            )
        )

    )

let settingsViews = new Views(
    mainContainer,
    homeDirectory
)


async function main() {
    me = (await ajax({ "url": "/api/users/me", "method": "GET" })).data

    if (me != null) {
        document.getElementById("profileDetails").classList.remove("hidden")
        document.getElementById("signin").classList.add("hidden")
        document.getElementById("myprofileLink").innerHTML = document.getElementById("myprofileLink").innerHTML.replace("%username%", me.username)
        document.getElementById("myprofileLink").href = `/users/${me.id}`
    }

    try {
        app()
    } catch (err) {
        console.log("No App")
    }

}

main()

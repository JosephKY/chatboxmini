

let pullUpUser;
let userPulled = false;
let pullUpPost
let postPulled = false;

let currentUser;
let currentUsersPostsStartingId;

let currentPost;

let currentReport;

class RestrictionTemplate {
    constructor(reason, countries, regions, hidecontent) {
        this.reason = reason
        this.countries = countries
        this.regions = regions
        this.hidecontent = hidecontent
    }
}

let restrictionTemplates = {
    "copyright": new RestrictionTemplate(
        "Post violated Feed's copyright policies",
        ['*'],
        [],
        true
    ),
    "hatefuloroffensive": new RestrictionTemplate(
        "Post may content hateful or offensive content",
        ['*'],
        [],
        false
    ),
    "misinformation": new RestrictionTemplate(
        "Post may content misinformation or disinformation. Confirm what you are reading by checking reliable sources",
        ['*'],
        [],
        false
    ),
    "inappropriate": new RestrictionTemplate(
        "Post may content inappropriate content",
        ['*'],
        [],
        false
    ),
    "violation": new RestrictionTemplate(
        "Post violated Feed's Community Guidelines or Terms of Service",
        ['*'],
        [],
        true
    )
}

function updateTemplate(val) {
    let template = restrictionTemplates[val]
    if (!template) return

    restrictionReason.value = template.reason
    restrictionCountries.value = JSON.stringify(template.countries)
    restrictionRegions.value = JSON.stringify(template.regions)
    restrictionHide.checked = template.hidecontent
}

async function createPostRestriction(){
    console.log(currentPost)
    let ret = (await ajax({
        "url":"/api/moderation/createRestriction",
        "type":"POST",
        "data":{
            'reason': restrictionReason.value,
            'countries': restrictionCountries.value,
            'regions': restrictionRegions.value,
            'hidecontent': transrev[restrictionHide.checked],
            'postid': currentPost
        }
    }));

    if(!ret){
        return notification("Something went wrong creating that restriction", 5000);
    }

    if(ret.type == 'error'){
        return notification(ret.data, 5000)
    }

    notification("Restriction created successfully", 5000, green)
    pullUpPost(currentPost)
}

function composePostRestriction(){
    document.getElementById("composePostRestriction").classList.remove("hidden")
}

function manageUsersSearchSubmit() {
    pullUpUser(document.getElementById("manageUsersSearchInput").value)
}

function managePostSearchSubmit() {
    pullUpPost(document.getElementById("managePostSearchInput").value)
}

async function manageUsersUsernameSubmit() {
    let res = (await ajax({
        "type": "PATCH",
        "url": "/api/users/changeUsername",
        "data": {
            userid: currentUser,
            username: document.getElementById("manageUsersUsername").value
        }
    }))

    if (!res) {
        return notification("Something went wrong", 5000);
    }

    if (res.type == 'error') {
        return notification(res.data, 5000)
    }

    notification("Username changed successfully", 3000, green)
}

async function manageUsersEmailSubmit() {
    let res = (await ajax({
        "type": "PATCH",
        "url": "/api/users/changeEmail",
        "data": {
            userid: currentUser,
            email: document.getElementById("manageUsersEmail").value
        }
    }))

    if (!res) {
        return notification("Something went wrong", 5000);
    }

    if (res.type == 'error') {
        return notification(res.data, 5000)
    }

    document.getElementById("manageUsersEmailVerified").checked = false
    notification("Email changed successfully", 3000, green)
}

async function manageUsersEmailVerifiedSubmit() {
    let res = (await ajax({
        "type": "PATCH",
        "url": "/api/moderation/setEmailVerifiedManual",
        "data": {
            userid: currentUser,
            toggle: transrev[document.getElementById("manageUsersEmailVerified").checked]
        }
    }))

    if (!res) {
        return notification("Something went wrong", 5000);
    }

    if (res.type == 'error') {
        return notification(res.data, 5000)
    }

    notification("Email verification status changed successfully", 3000, green)
}

async function manageUsersVerifiedSubmit() {
    let res = (await ajax({
        "type": "PATCH",
        "url": "/api/moderation/setVerified",
        "data": {
            userid: currentUser,
            toggle: transrev[document.getElementById("manageUsersVerified").checked]
        }
    }))

    if (!res) {
        return notification("Something went wrong", 5000);
    }

    if (res.type == 'error') {
        return notification(res.data, 5000)
    }

    notification("Verification status changed successfully", 3000, green)
}

async function manageUsersSuspendedSubmit() {
    let res = (await ajax({
        "type": "PATCH",
        "url": "/api/moderation/setSuspended",
        "data": {
            userid: currentUser,
            toggle: transrev[document.getElementById("manageUsersSuspended").checked]
        }
    }))

    if (!res) {
        return notification("Something went wrong", 5000);
    }

    if (res.type == 'error') {
        return notification(res.data, 5000)
    }

    notification("Suspension status changed successfully", 3000, green)
}

async function manageUsersLoadPosts() {
    let container = document.getElementById("manageUsersPosts")
    document.getElementById("manageUsersLoadPosts").disabled = true

    let res = (await ajax({
        "url": "/api/posts/feed/user",
        "type": "GET",
        "data": {
            max: 15,
            startingId: currentUsersPostsStartingId,
            userid: currentUser
        }
    }))

    document.getElementById("manageUsersLoadPosts").disabled = false

    if (!res) {
        return notification("Something went wrong", 5000);
    }

    if (res.type == 'error') {
        return notification(res.data, 5000)
    }

    let posts = res.data;
    if (posts.length == 0) {
        document.getElementById("manageUsersLoadPosts").remove()
        return;
    }

    currentUsersPostsStartingId = posts[posts.length - 1].id

    posts.forEach(post => {
        let postElement = document.createElement("button")
        postElement.onclick = () => {
            pullUpPost(post.id)
        }
        postElement.classList.add("buttonlink")
        if (!post.content) {
            post.content = "(No Content)"
        }

        postElement.innerHTML = `#${post.id} - ${post.content}`

        if (post.restrictions.length > 0) {
            postElement.innerHTML = `#${post.id} (Restricted) - ${post.content}`
        }

        post.restrictions.forEach(r => {
            if (r.hidecontent == 1) {
                postElement.innerHTML = `${postElement.innerHTML} <i>(Content Restricted)</i>`
            }
        })

        if (post.deleted == 1) {
            postElement.innerHTML = `${postElement.innerHTML} <i>(Post Deleted)</i>`
        }

        container.appendChild(postElement)
        container.appendChild(document.createElement("br"))

    })
}

function app() {
    let mainContainer = document.getElementById("adminControls")
    let mainPage = document.getElementById("adminPage")

    let homeDirectory = new ViewDirectory()

    let manageUsersPage = (new ViewPage(
        "/admin/manageUsers",
        mainPage
    ))

    homeDirectory.addCategory(
        new ViewCategory(
            "Manage Users",
            manageUsersPage,
            "/assets/group.svg"
        )
    )

    let managePostsPage = (new ViewPage(
        "/admin/managePosts",
        mainPage
    ))

    homeDirectory.addCategory(
        new ViewCategory(
            "Manage Posts",
            managePostsPage,
            "/assets/chat.svg"
        )
    )

    homeDirectory.addCategory(
        new ViewCategory(
            "Manage Reports",
            (new ViewPage(
                "/admin/manageReports",
                mainPage
            )),
            "/assets/report.png"
        )
    )

    new Views(
        mainContainer,
        homeDirectory
    )

    pullUpUser = async function pullUpUser(idOrUsername) {
        userPulled = false;

        let user = (await ajax({
            "url": `/api/users/${idOrUsername}`,
            "type": "GET"
        }))

        if (!user) {
            notification("Something went wrong getting that user!", 5000)
            return
        }

        if (user.type == 'error') {
            notification(user.data, 5000)
            return
        }

        user = user.data;
        currentUser = user.id;

        console.log(user)
        console.log(manageUsersPage)

        manageUsersPage.onload(() => {
            currentUsersPostsStartingId = undefined;

            document.getElementById("manageUsersUsername").value = user.username;
            document.getElementById("manageUsersId").innerHTML = `#${user.id}`
            document.getElementById("manageUsersEmail").value = user.email
            document.getElementById("manageUsersCreated").valueAsNumber = user.created * 1000
            document.getElementById("manageUsersDob").valueAsNumber = user.dob * 1000
            document.getElementById("manageUsersCountry").value = user.country
            document.getElementById("manageUsersEmailVerified").checked = trans[user.emailverified]
            document.getElementById("manageUsersVerified").checked = trans[user.verified]
            document.getElementById("manageUsersSuspended").checked = trans[user.suspended]

            Array.from(document.getElementById("manageUsersPosts").childNodes).forEach(n => {
                n.remove()
            })

            document.getElementById("manageUsers").classList.remove("hidden")

            manageUsersLoadPosts()
        })
        manageUsersPage.load()
    }

    pullUpPost = async function (id) {
        currentPost = id

        let post = (await ajax({
            "url": `/api/posts/${id}`,
            "type": "GET"
        }))

        if (!post) {
            return notification("Something went wrong retrieving that post!", 5000)
        }

        if (post.type == 'error') {
            return notification(post.data, 5000)
        }

        post = post.data

        let user = (await ajax({
            "url": `/api/users/${post.userid}`,
            "type": "GET"
        }))

        if (!user) {
            notification("Something went wrong getting the post author!", 5000)
            return
        }

        if (user.type == 'error') {
            notification(`${user.data} ${user.code}`, 5000)
            return
        }

        user = user.data

        managePostsPage.onload(() => {
            let restrictionReason = document.getElementById("restrictionReason")
            let restrictionCountries = document.getElementById("restrictionCountries")
            let restrictionRegions = document.getElementById("restrictionRegions")
            let restrictionHide = document.getElementById("restrictionHide")

            let restrictionselect = document.getElementById("composePostRestrictionTemplates")
            Array.from(restrictionselect.options).forEach(option => {
                console.log(option.value, restrictionTemplates[option.value])
                let val = option.value
                if (!val) return;

                let template = restrictionTemplates[val]
                if (!template) return

                if (option.onselect != undefined) return

                option.onselect = () => {
                    restrictionReason.value = template.reason
                    restrictionCountries.value = template.countries
                    restrictionRegions.value = template.regions
                    restrictionHide.checked = template.hidecontent
                }
            })

            document.getElementById("managePostId").innerHTML = `#${post.id}`
            document.getElementById("managePostContent").value = post.content
            document.getElementById("managePostAuthor").innerHTML = user.username;
            document.getElementById("managePostAuthor").onclick = () => {
                pullUpUser(post.userid)
            }
            document.getElementById("managePostCreated").valueAsNumber = post.created * 1000
            document.getElementById("managePostDeleted").checked = trans[post.deleted]
            document.getElementById("managePost").classList.remove("hidden")

            Array.from(document.getElementsByClassName("managePostRestrictionRow")).forEach(row => {
                row.remove()
            })

            post.restrictions.forEach(restriction => {
                let row = document.createElement("tr")
                row.classList.add("managePostRestrictionRow")

                let idCell = document.createElement("td")
                idCell.innerHTML = restriction.id;

                let createdCell = document.createElement("td")
                createdCell.innerHTML = new Date(restriction.created * 1000).toLocaleString()

                let countriesCell = document.createElement("td")
                restriction.countries.forEach(c => {
                    countriesCell.innerHTML = `${c}</br>`
                })

                let regionsCell = document.createElement("td")
                restriction.regions.forEach(c => {
                    regionsCell.innerHTML = `${c}</br>`
                })

                let reasonCell = document.createElement("td")
                reasonCell.innerHTML = restriction.reason

                let hideCell = document.createElement("td")
                hideCell.innerHTML = restriction.hidecontent;
                
                let actionsCell = document.createElement("td")
                let removeAction = document.createElement("button")
                removeAction.innerHTML = "Remove"
                removeAction.onclick = async () =>{
                    let res = (await ajax({
                        url:"/api/moderation/removeRestriction",
                        type:"DELETE",
                        data: {
                            id: restriction.id
                        }
                    }))

                    if(!res){
                        return notification("Something went wrong removing that restriction", 5000)
                    }

                    if(res.type == 'error'){
                        return notification(res.data, 5000);
                    }

                    notification("Restriction deleted", 5000, green)
                    row.remove()
                }
                actionsCell.appendChild(removeAction);

                [idCell, createdCell, countriesCell, regionsCell, reasonCell, hideCell, actionsCell].forEach(i => { row.appendChild(i) })

                document.getElementById("managePostRestrictionsTable").appendChild(row)
            })



        })

        managePostsPage.load()
    }
}

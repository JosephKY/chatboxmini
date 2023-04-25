

let pullUpUser;

function manageUsersSearchSubmit(){
    pullUpUser(document.getElementById("manageUsersSearchInput").value)
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

    homeDirectory.addCategory(
        new ViewCategory(
            "Manage Posts",
            (new ViewPage(
                "/admin/managePosts",
                mainPage
            )),
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
        let user = (await ajax({
            "url": `/api/users/${idOrUsername}`,
            "type": "GET"
        }))

        if (!user) {
            notification("Something went wrong getting that user!")
            return
        }

        if (user.type == 'error') {
            notification(user.data)
            return
        }

        user = user.data;
        console.log(user)
        console.log(manageUsersPage)

        manageUsersPage.onload(() => {
            document.getElementById("manageUsersUsername").value = user.username;
            document.getElementById("manageUsersId").innerHTML = `#${user.id}`
            document.getElementById("manageUsersEmail").value = user.email
            document.getElementById("manageUsersCreated").valueAsNumber = user.created * 1000
            document.getElementById("manageUsersDob").valueAsNumber = user.dob * 1000
            document.getElementById("manageUsersEmailVerified").checked = trans[user.emailverified]
            document.getElementById("manageUsersVerified").checked = trans[user.verified]
            document.getElementById("manageUsersSuspended").checked = trans[user.suspended]

            document.getElementById("manageUsers").classList.remove("hidden")
        })
        manageUsersPage.load()
    }
}

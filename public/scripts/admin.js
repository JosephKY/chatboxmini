function app() {
    let mainContainer = document.getElementById("adminControls")
    let mainPage = document.getElementById("adminPage")

    let homeDirectory = new ViewDirectory()

    homeDirectory.addCategory(
        new ViewCategory(
            "Manage Users",
            (new ViewPage(
                "/admin/manageUsers",
                mainPage
            )),
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
}

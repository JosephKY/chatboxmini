function app() {
    let mainContainer = document.getElementById("settingsContainer")
    let mainPage = document.getElementById("settingsPage")

    let homeDirectory = new ViewDirectory()

    if (me != null) {
        homeDirectory.addCategory(
            new ViewCategory(
                "My Account",
                (new ViewDirectory()
                    .addCategory(
                        new ViewCategory(
                            "Change Username",
                            new ViewPage("/setting/changeUsername", mainPage),
                            "/assets/signature.png"
                        )
                    )
                    .addCategory(
                        new ViewCategory(
                            "Change Password",
                            new ViewPage("/setting/changePassword", mainPage),
                            "/assets/password.png"
                        )
                    )
                    .addCategory(
                        new ViewCategory(
                            "Email",
                            new ViewPage("/setting/email", mainPage)
                                .onload(() => {
                                    let strVal = {
                                        0: "not verified",
                                        1: "verified"
                                    }
                                    document.getElementById("settingsEmailVerifyStatus").innerHTML = `${me.email} is <b>${strVal[me.emailverified]}</b>`

                                    if (me.emailverified == 0) {
                                        document.getElementById("settingsSendEmailVerify").classList.remove("hidden")
                                    }

                                })
                            ,
                            "/assets/mail.png"
                        )
                    )
                    .addCategory(
                        new ViewCategory(
                            "Delete Account",
                            new ViewPage("/setting/deleteAccount", mainPage),
                            "/assets/heartbreak.png"
                        )
                    )
                ),
                "/assets/person.png"
            )

        )
    }

    homeDirectory.addCategory(
        new ViewCategory(
            "Language",
            (new ViewPage(
                "/",
                mainPage
            )),
            "/assets/language.png"
        )
    )

    homeDirectory.addCategory(
        new ViewCategory(
            "Help and Information",
            (new ViewDirectory()
                .addCategory(
                    new ViewCategory(
                        "Help Center",
                        undefined,
                        "/assets/helpsquare.png"
                    ).onclick(() => { window.open("/help", "_blank") })
                )
                .addCategory(
                    new ViewCategory(
                        "Terms of Service",
                        undefined,
                        "/assets/legal.png"
                    ).onclick(() => { window.open("/terms", "_blank") })
                )
                .addCategory(
                    new ViewCategory(
                        "Privacy Policy",
                        undefined,
                        "/assets/privacypolicy.png"
                    ).onclick(() => { window.open("/privacy", "_blank") })
                )
                .addCategory(
                    new ViewCategory(
                        "Community Guidelines",
                        undefined,
                        "/assets/diversity.png"
                    ).onclick(() => { window.open("/guidelines", "_blank") })
                )
                .addCategory(
                    new ViewCategory(
                        "Support",
                        undefined,
                        "/assets/support.png"
                    ).onclick(() => { window.open("mailto:support@youcc.xyz", "_blank") })
                )
            ),
            "/assets/help.svg"
        )
    )

    new Views(
        mainContainer,
        homeDirectory
    )
}

let lastUsernameInput = 0
function settingNewUsernameInput() {
    let now = Date.now()
    lastUsernameInput = now
    let username = document.getElementById("settingsNewUsernameField").value

    let usernameFlair = document.getElementById("settingsNewUsernameStatus")
    usernameFlair.innerHTML = ""

    let usernameSubmit = document.getElementById("settingsNewUsernameSubmit")
    usernameSubmit.disabled = true

    setTimeout(async () => {

        if (lastUsernameInput != now) return
        let check = (await ajax({
            "url": "/api/users/usernameTaken",
            "data": {
                "username": username
            },
            "method": "GET"
        })).data;
        console.log(check)
        usernameFlair.style.color = "red"
        if (check == -1) {
            usernameFlair.innerHTML = "Invalid username"
        } else if (check === false) {
            usernameFlair.style.color = "green"
            usernameFlair.innerHTML = "Username available"
            usernameSubmit.disabled = false
        } else if (check === true) {
            usernameFlair.innerHTML = "Username taken"
        }
    }, 500)
}

async function settingsNewUsernameSubmit() {
    let usernameSubmit = document.getElementById("settingsNewUsernameSubmit")
    usernameSubmit.disabled = true

    let usernameInput = document.getElementById("settingsNewUsernameField")
    usernameInput.disabled = true

    let change = (await ajax({
        "url": "/api/users/changeUsername",
        "type": "PATCH",
        "data": {
            "username": usernameInput.value
        }
    }));

    console.log(change)
    usernameInput.disabled = false

    if (!change) {
        notification("Something went wrong")
        return
    }

    if (change.type == 'error') {
        notification(change.data)
        return
    }

    notification("Username changed successfully!", 5000, green)
    document.getElementById("myprofileLink").innerHTML = usernameInput.value
    me.username = usernameInput.value
    usernameInput.value = ""
}

async function settingNewPasswordInput() {
    let currentPass = document.getElementById("settingsCurrentPasswordField")
    let newPass = document.getElementById("settingsNewPasswordField")
    let verifyPass = document.getElementById("settingsNewPasswordVerifyField")
    let passSubmit = document.getElementById("settingsNewPasswordSubmit")

    passSubmit.disabled = true

    let val = valPass(newPass.value, verifyPass.value);

    function setFlair(status) {
        document.getElementById("settingsNewPasswordStatus").innerHTML = status
    }

    switch (val) {
        case -1:
            setFlair("Minimum 8 characters")
            return
        case -2:
            setFlair("Maximum 128 characters")
            return
        case -3:
            setFlair("Passwords must match")
            return
    }

    if (!currentPass.value) {
        setFlair("Enter your current password to change it")
        return
    }

    if (currentPass.value == newPass.value) {
        setFlair("New password cannot be same as old password")
        return
    }

    setFlair("")
    passSubmit.disabled = false
}

async function settingsNewPasswordSubmit() {
    let currentPass = document.getElementById("settingsCurrentPasswordField");
    let newPass = document.getElementById("settingsNewPasswordField");
    let verifyPass = document.getElementById("settingsNewPasswordVerifyField");
    let passSubmit = document.getElementById("settingsNewPasswordSubmit");

    [currentPass, newPass, verifyPass, passSubmit].forEach(p => {
        p.disabled = true
    })

    let setPass = (await ajax({
        "url": "/api/users/setpassword",
        "type": "GET",
        "data": {
            token: currentPass.value,
            newPassword: newPass.value
        }
    }));

    [currentPass, newPass, verifyPass, passSubmit].forEach(p => {
        p.disabled = false
    })

    if (!setPass) {
        notification("Something went wrong", 5000);
        return
    }

    if (setPass.type == 'error') {
        notification(setPass.data, 5000);
        if (setPass.code == 1706) {
            document.getElementById("settingsCurrentPasswordField").value = ""
        }
        return;
    }

    notification("Password changed successfully", 5000, green)
}

function settingsNewEmailField() {
    let currentPassInput = document.getElementById("settingsCurrentPasswordField").value
    let emailInput = document.getElementById("settingsNewEmailField").value
    let emailSubmit = document.getElementById("settingsNewEmailSubmit")
    let val = valEmail(emailInput)

    if (val && currentPassInput.length > 0) {
        emailSubmit.disabled = false
    } else {
        emailSubmit.disabled = true
    }
}

async function settingsNewEmailSubmit() {
    let currentPassInput = document.getElementById("settingsCurrentPasswordField")
    let emailInput = document.getElementById("settingsNewEmailField")
    let emailSubmit = document.getElementById("settingsNewEmailSubmit");

    [currentPassInput, emailInput, emailSubmit].forEach(i => { i.disabled = true })

    let res = (await ajax({
        "url": "/api/users/changeEmail",
        "type": "PATCH",
        "data": {
            email: emailInput.value,
            currentPassword: currentPassInput.value
        }
    }));

    [currentPassInput, emailInput, emailSubmit].forEach(i => { i.disabled = false })

    if (!res) {
        notification("Something went wrong", 5000);
        return;
    }

    if (res.type == 'error') {
        notification(res.data, 5000);
        return;
    }

    notification("Email changed successfully", 5000, green)
    me.emailverified = 0;
    document.getElementById("settingsEmailVerifyStatus").innerHTML = `${emailInput.value} is <b>not verified</b>`
    document.getElementById("settingsSendEmailVerify").classList.remove("hidden")

}

async function settingsSendEmailVerify() {
    document.getElementById("settingsSendEmailVerify").disabled = true;
    if (me.emailverified == 1) {
        notification("Email already verified", 5000);
        return;
    }

    let res = (await ajax({
        "url": "/api/users/verify",
        "type": "GET"
    }))

    document.getElementById("settingsSendEmailVerify").disabled = false;

    if (!res) {
        notification("Something went wrong", 5000);
        return;
    }

    if (res.type == 'error') {
        notification(res.data, 5000);
        return;
    }

    notification("Verification email sent. Check your inbox and spam folder", 5000, green);

}

function settingsDeleteAccountVerifyConsent() {
    let consent = document.getElementById("settingsDeleteAccountConsent")
    let currentPass = document.getElementById("settingsDeleteAccountCurrentPassword")
    let submit = document.getElementById("settingsDeleteAccountSubmit")

    if (consent.checked == true && currentPass.value.length > 0) {
        submit.disabled = false;
    } else {
        submit.disabled = true
    }
}

async function settingsDeleteAccountSubmit() {
    let consent = document.getElementById("settingsDeleteAccountConsent")
    let currentPass = document.getElementById("settingsDeleteAccountCurrentPassword")
    let submit = document.getElementById("settingsDeleteAccountSubmit");

    [consent, currentPass, submit].forEach(i => {
        i.disabled = true;
    })

    let res = (await ajax({
        "type": "DELETE",
        "url": "/api/users/deleteAccount",
        "data": {
            currentPassword: currentPass.value
        }
    }))

    if (!res) {
        notification("Something went wrong", 5000);
        [consent, currentPass, submit].forEach(i => {
            i.disabled = false;
        })
        return;
    }

    if (res.type == 'error') {
        notification(res.data, 5000);
        [consent, currentPass, submit].forEach(i => {
            i.disabled = false;
        })
        return;
    }

    document.body.classList.add("takecarefriend")
    setTimeout(() => {
        window.location.href = "/"
    }, 7000)
}
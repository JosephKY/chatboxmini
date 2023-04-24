// Modules
const express = require("express")
const cookies = require("cookie-parser")
const fs = require("fs")

// Services
const restrictionsService = require("./src/services/restrictions.service")
const localeService = require("./src/services/locale.service")
const { isLoggedIn } = require("./src/services/jwt.service")

// Routes
const apiRoute = require("./src/routes/api.route")

// Configs
const restrictionsConfig = require("./src/configs/restrictions.config")
const postConfig = require("./src/configs/post.config")
const userConfig = require("./src/configs/user.config")
const articlesConfig = require("./src/configs/articles.config")
const adminConfig = require("./src/configs/admin.config")

// Work
for (let name in restrictionsConfig) {
    restrictionsService.addActivity(name)
    restrictionsConfig[name].forEach(r => {
        restrictionsService.addRestriction(name, r[0], r[1])
    })
}

let blackbook = fs.readFileSync("src/configs/blackbook.txt")
blackbook.toString().replaceAll("\r", "").split("\n").forEach(b => {
    postConfig.bannedDomains.push(b)
})

const app = express()
const port = 3000


app.use(cookies());
app.set("view engine", "ejs");

app.use(express.static('public', {
    extensions: ['html', 'htm'],
}));

app.use("/api", apiRoute)

function renderPage(req, res, page, index="index", extras={}, adminonly=false) {
    try {
        const localeData = localeService.getLocale(req, res);
        let replicated = {
            locale: localeData,
            page: page,
        };
        replicated = Object.assign({}, replicated, extras)

        let render = index
        if(index == false){
            render = page
        } 

        let login = isLoggedIn(req)
        if(adminonly && (!login || !(adminConfig.admins.includes(login.sub)))){
            page = "user";
            replicated.page = "user";
            render = "index";
        }

        res.render(render, replicated)
    } catch (error) {
        // Handle any errors that might occur
        res.status(500).send("Internal Server Error")
    }
}


app.get("/", async (req, res) => {
    renderPage(req, res, "home")
})

app.get("/home", async (req, res) => {
    renderPage(req, res, "home")
})

app.get("/signout", async (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/")
})

app.get("/login", async (req, res) => {
    renderPage(req, res, "login")
})

app.get("/resetpassword", async (req, res)=>{
    renderPage(req, res, "resetpassword")
})

app.get("/settings", async (req, res) => {
    renderPage(req, res, "settings")
})

app.get("/verify", async (req, res) => {
    renderPage(req, res, "verify")
})

app.get("/terms", async (req, res) => {
    renderPage(req, res, "terms")
})

app.get("/privacy", async (req, res) => {
    renderPage(req, res, "privacy")
})

app.get("/guidelines", async (req, res) => {
    renderPage(req, res, "guidelines")
})

app.get("/report", async (req, res) => {
    renderPage(req, res, "report")
})

app.get("/help", async (req, res) => {
    renderPage(req, res, "help", "helpindex", { articles: articlesConfig })
})

userConfig.settings.forEach(setting=>{
    app.get(`/setting/${setting}`, async(req, res)=>{
        renderPage(req, res, `settings/${setting}`, false)
    })
})

for(let [articleId, _] of Object.entries(articlesConfig)){
    app.get(`/help/raw/${articleId}`, async(req, res)=>{
        renderPage(req, res, `articles/${articleId}`, false)
    })

    app.get(`/help/${articleId}`, async (req, res) => {
        renderPage(req, res, "helparticle", "helpindex", { article: articleId, articles: articlesConfig })
    })
}

app.get("/admin", async (req, res)=>{
    renderPage(req, res, "admin", "index", {}, true)
})

userConfig.admin.forEach(adminPage=>{
    app.get(`/admin/${adminPage}`, async (req, res) => {
        renderPage(req, res, `admin/${adminPage}`, false, {}, true)
    })
})

app.get("/post/:id", async (req, res) => {
    renderPage(req, res, "post")
})

app.get("/:username", async (req, res) => {
    renderPage(req, res, "user")
})

app.get('*', async (req, res) => {
    renderPage(req, res, "notfound")
})

app.listen(port, () => {
    console.log(`Chatbox Mini listening on port ${port}`)
})
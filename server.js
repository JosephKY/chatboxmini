// Modules
const express = require("express")
const cookies = require("cookie-parser")
const fs = require("fs")

// Services
const restrictionsService = require("./src/services/restrictions.service")
const localeService = require("./src/services/locale.service")

// Routes
const apiRoute = require("./src/routes/api.route")

// Configs
const restrictionsConfig = require("./src/configs/restrictions.config")
const postConfig = require("./src/configs/post.config")

// Work
for(let name in restrictionsConfig){
    restrictionsService.addActivity(name)
    restrictionsConfig[name].forEach(r=>{
        restrictionsService.addRestriction(name, r[0], r[1])
    })
}

let blackbook = fs.readFileSync("src/configs/blackbook.txt")
blackbook.toString().replaceAll("\r", "").split("\n").forEach(b=>{
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

function renderPage(req, res, page) {
    try {
      const localeData = localeService.getLocale(req, res);
      const replicated = {
        locale: localeData,
        page: page,
      };
      res.render("index", replicated);
    } catch (error) {
      // Handle any errors that might occur
      res.status(500).send("Internal Server Error")
    }
  }
  

app.get("/", async(req, res)=>{
    renderPage(req, res, "home")
})

app.get("/home", async(req, res)=>{
    renderPage(req, res, "home")
})

app.get("/signout", async(req, res)=>{
    res.clearCookie("jwt");
    res.redirect("/")
})

app.get("/login", async(req, res)=>{
    renderPage(req, res, "login")
})

app.get('*', async (req, res)=>{
    renderPage(req, res, "notfound")
})





app.listen(port, () => {
    console.log(`Chatbox Mini listening on port ${port}`)
})
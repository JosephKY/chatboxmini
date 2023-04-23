let Article = require("../models/article.model")

let articles = {
    "terms_4-22-23":new Article("terms_4-22-23", "Terms of Service", "Effective April 22nd, 2023", 1682164800, "/assets/legal.png"),
    "privacy_4-22-23":new Article("privacy_4-22-23", "Privacy Policy", "Effective April 22nd, 2023", 1682164800, "/assets/privacypolicy.png"),
    "guidelines_4-22-23":new Article("guidelines_4-22-23", "Community Guidelines", "Effective April 22nd, 2023", 1682164800, "/assets/diversity.png"),
    "fileaclaim":new Article("fileaclaim", "File a Copyright Claim", "Your intellectual property rights matter to us", 1682164800, "/assets/copyright.svg")
};



module.exports = articles
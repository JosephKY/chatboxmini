let articleData = articles[articleId];

document.getElementById("articleIcon").src = articleData.icon
document.getElementById("articleTitle").innerHTML = articleData.title
document.getElementById("articleSubtitle").innerHTML = articleData.subtitle
document.getElementById("articleDate").innerHTML = new Date(articleData.date * 1000).toDateString()

async function loadArticle(){
    let articleHtml = (await ajax({
        "url":`/help/raw/${articleId}`
    }))


    if(!articleHtml){
        articleHtml = "<p>This article failed to load. Please try again later</p>"
    } 

    document.getElementById('articleContent').innerHTML = articleHtml
}

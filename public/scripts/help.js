let searchRelation = {}

function safeSearch(str){
    str = String(str)
    str = str.trim()
    str = str.toLowerCase()
    str = str.replace(/\s+/g, '')
    return str;
}

for(let [articleId, articleData] of Object.entries(articles)){
    let articleName = String(articleData.title)
    articleName = safeSearch(articleName)
    searchRelation[articleName] = articleId
}

let searchInput = document.getElementById("articleSearchInput")
let searchResultsContainer = document.getElementById("searchResultsContainer")
let searchResultsMaster = document.getElementById("searchResultsMaster")
let lastSearchInput = 0

searchInput.value = ""

searchInput.onfocus = ()=>{
    searchResultsMaster.classList.remove("hidden")
}

searchInput.oninput = ()=>{
    let viewportOffset = searchInput.getBoundingClientRect();
    console.log(viewportOffset)
    searchResultsContainer.style.top = `${viewportOffset.top + viewportOffset.height + 10}px`
    searchResultsContainer.style.left = `${viewportOffset.left}px`
    searchResultsContainer.classList.remove("hidden")

    let searchInputValue = searchInput.value;
    let our = Date.now()
    lastSearchInput = our
    setTimeout(()=>{
        if(lastSearchInput != our)return;
        let spacesplit = searchInputValue.split(" ")
        let results = []

        spacesplit.forEach(query=>{
            if(!query)return
            if(query == '*')query = ""
            query = safeSearch(query)
            for(let [match, articleData] of Object.entries(searchRelation)){
                if(match.includes(query) && results.includes(articleData) == false){
                    results.push(articleData)
                }
            }
        })

        let noresults = document.getElementById("searchResultsNoResults")

        
        Array.from(document.getElementsByClassName("articleSearchResult")).forEach(oldresult=>{
            oldresult.remove()
        })
        
        console.log(results)
        if(results.length == 0){
            noresults.classList.remove("hidden")
        } else {
            noresults.classList.add("hidden")
        }

        results.forEach(articleId=>{
            console.log("result:")
            console.log(articleId)
            articleData = articles[articleId]    
        
            let resultElement = document.createElement("div")
            resultElement.classList.add("articleSearchResult")
            
            let resultIconElement = document.createElement("img")
            resultIconElement.classList.add("articleSearchResultIcon")
            resultIconElement.src = articleData.icon
            resultElement.appendChild(resultIconElement)

            let resultDetailsElement = document.createElement("div")
            resultDetailsElement.classList.add("articleSearchResultDetails")
            resultElement.appendChild(resultDetailsElement)

            let resultTitleElement = document.createElement("span")
            resultTitleElement.classList.add("articleSearchResultTitle")
            resultTitleElement.innerHTML = articleData.title
            resultDetailsElement.appendChild(resultTitleElement)

            let resultDateElement = document.createElement("span")
            resultDateElement.innerHTML = (new Date(articleData.date * 1000)).toDateString()
            resultDateElement.classList.add("articleSearchResultDate")
            resultDetailsElement.appendChild(resultDateElement)

            resultElement.addEventListener("click", ()=>{
                window.location.href = `/help/${articleId}`
            })

            searchResultsContainer.appendChild(resultElement)
        })
        

    }, 300)
}

searchResultsMaster.addEventListener("click", e=>{
    if(e.target != searchResultsMaster)return
    searchResultsMaster.classList.add("hidden")
})

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

if (getCookie('cookieagreement') == null) {
    document.getElementById("cookienoticecontainer").classList.remove("hidden")
}

function articleListing(article) {
    let listingElement = document.createElement("div")
    listingElement.classList.add("articleListing")

    let listingElementIcon = document.createElement("img")
    listingElementIcon.src = article.icon
    listingElementIcon.classList.add("articleListingIcon")
    listingElement.appendChild(listingElementIcon)

    let listingElementDetails = document.createElement("div")
    listingElementDetails.classList.add("articleListingDetails")
    listingElement.appendChild(listingElementDetails)

    let listingElementTitle = document.createElement("p")
    listingElementTitle.classList.add("articleListingTitle")
    listingElementTitle.innerHTML = article.title
    listingElementDetails.appendChild(listingElementTitle)

    let listingElementDate = document.createElement("p")
    listingElementDate.classList.add("articleListingDate")
    listingElementDate.innerHTML = (new Date(article.date * 1000)).toDateString()
    listingElementDetails.appendChild(listingElementDate)

    listingElement.addEventListener("click", ()=>{
        window.location.href = `/help/${article.id}`
    })

    return listingElement
}

if(document.getElementById("featured") != undefined){
    loadFeatured()
}

if(document.getElementById("article") != undefined){
    loadArticle()
}
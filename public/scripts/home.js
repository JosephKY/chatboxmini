async function app(){
    let homeFeed = new Feed(document.getElementById("homeContent"), "all")
    homeFeed.load({
        "max":15
    })

    homeFeed.onEndScroll = ()=>{
        homeFeed.load({
            "max":15,
            "startingId":homeFeed.lastPostId
        })
    }
}
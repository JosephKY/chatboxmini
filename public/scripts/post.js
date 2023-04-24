async function app(){
    let postid = window.location.pathname.split("/")[2]
    let postErrorElement = document.getElementById("postError")

    let postElementData = (await ajax({
        'url':`/api/posts/${postid}`,
        'type':"GET"
    }))

    if(!postElementData){
        postErrorElement.innerHTML = "Something went wrong"
        return
    }

    if(postElementData.type == 'error'){
        postErrorElement.innerHTML = postElementData.data
        return
    }

    postElementData = postElementData.data

    if(postElementData.deleted == 1){
        postErrorElement.innerHTML = "Post has been deleted"
        return
    }

    let postElement = (await genPostElement(postElementData, {postClasses: ['bigPost']}))
    document.getElementById("post").appendChild(postElement)

}
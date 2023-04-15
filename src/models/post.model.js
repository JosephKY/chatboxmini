class Post{
    constructor(id, created, userid, content){
        this.id = id
        this.created = created
        this.userid = userid
        this.content = content
        this.restrictions = []
    }
}

module.exports = Post
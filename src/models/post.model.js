class Post{
    constructor(id, created, userid, content, deleted){
        this.id = id
        this.created = created
        this.userid = userid
        this.content = content
        this.restrictions = []
        this.actions = []
        this.deleted = deleted
    }
}

module.exports = Post
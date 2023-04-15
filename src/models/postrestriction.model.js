class PostRestriction {
    constructor(post, id, created, countries, regions, reason, hidecontent){
        this.id = id
        this.created = created
        this.postid = post.id
        this.countries = countries
        this.regions = regions
        this.reason = reason
        this.hidecontent = hidecontent

        post.restrictions.push(this)
    }
}

module.exports = PostRestriction
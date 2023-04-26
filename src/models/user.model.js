class User{
    constructor(id, created, username, pass, email, emailverified, suspended, verified, dob, country){
        this.id = id
        this.created = created
        this.username = username
        this.pass = pass
        this.email = email
        this.emailverified = emailverified
        this.suspended = suspended
        this.verified = verified
        this.dob = dob
        this.country = country
        this.actions = []
    }
}

module.exports = User
class Report {
    constructor(id, created, type, relation, rule, method, message, userid, status){
        this.id = id;
        this.created = created;
        this.type = type;
        this.relation = relation;
        this.rule = rule;
        this.method = method;
        this.message = message;
        this.userid = userid;
        this.status = status
    }
}

module.exports = Report;
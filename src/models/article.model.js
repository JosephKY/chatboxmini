class Article {
    constructor(id, title, subtitle, date, icon="/assets/article.png"){
        this.id = id
        this.title = title;
        this.subtitle = subtitle;
        this.date = date;
        this.icon = icon
    }
};

module.exports = Article
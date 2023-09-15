const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

    const articleSchema = {
        title: String,
        content: String
    };

    const Article = mongoose.model('Article', articleSchema);

    //////////////////////////////////// targets all articles //////////////////////////////////

    app.route('/articles')
    
    .get(async function (req, res) {
        const foundArticles = await Article.find({});
        
        res.send(foundArticles);
    })
    
    .post(async function (req, res) {

        console.log(req.body.title);
        console.log(req.body.content);
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        await newArticle.save()
        .then(res.send("success"))
        .catch(function (err) {res.send(err);});
        
        
    })
    
    .delete(async function (req, res) {
        await Article.deleteMany()
        .then(res.send("successfully deleted all articles"))
        .catch(function (err) {res.send(err)});
    });

    //////////////////////////////// targets specific articles //////////////////////////////////

    app.route("/articles/:articleTitle")

    .get(async function (req, res) {
        await Article.findOne({title: req.params.articleTitle})
        .then(function (article) {
            if(!article){
                res.send("article not found");
            }
            else{
                res.send(article);
            }
        });
    })

    .put(async function (req, res) {
        await Article.replaceOne(
            {title: req.params.articleTitle},
            {title: req.body.title , content: req.body.content},
            );
    });

}

app.listen(3000, function() {
console.log("Server started on port 3000");
});

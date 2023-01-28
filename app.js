const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent =
  "Many people say that life isn't like a bed of roses. I beg to differ. I think that life is quite like a bed of roses. Just like life, a bed of roses looks pretty on the outside, but when you're in it, you find that it is nothing but thorns and pain. I myself have been pricked quite badly.";
const aboutContent =
  "Hi, I am Rakshit Jain, learning and developing front end web apps.";
const contactContent =
  "Please contact me on rakshitvipinjain21@gmail.com.";

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
  useNewUrlParser: true,
});
const postSchema = mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, foundPost) => {
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: foundPost,
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app
  .route("/compose")
  .get((req, res) => {
    res.render("compose");
  })
  .post((req, res) => {
    const title = req.body.postTitle;
    const content = req.body.postBody;
    const post = new Post({
      title: title,
      content: content,
    });
    post.save((err) => {
      if (!err) res.redirect("/");
    });
  });

app.get("/posts/:id", (req, res) => {
  Post.findById(req.params.id,(err,foundPost)=>{
      res.render("post", { post: foundPost });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started successfully");
});

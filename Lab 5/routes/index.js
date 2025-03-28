const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../util/auth");
const config = require("config");

router.get("/", verifyToken, (req, res, next) => {
  jwt.verify(req.token, config.get("jwtSecretKey"), (err, authData) => {
    if (err) {
      res.redirect("/login");
    } else {
      Blog.find().then((posts) => {
        res.render("index.ejs", { allPosts: posts });
      });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("login.ejs", { msg: "" });
});

router.get("/register", (req, res, next) => {
  res.render("register.ejs", { msg: "" });
});
router.get("/logout", (req, res, next) => {
  res.clearCookie("token");
  res.redirect("/login");
});

router.get("/chat", verifyToken, (req, res, next) => {
  jwt.verify(req.token, config.get("jwtSecretKey"), (err, authData) => {
    if (err) {
      res.redirect("/login");
    } else {
      res.render("chat.ejs");
    }
  });
});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username }).then();
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.render("login.ejs", { msg: "Wrong username or password" });
  } else {
    jwt.sign(
      {
        user: user,
      },
      config.get("jwtSecretKey"),
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/");
      }
    );
  }
});

router.post("/register", async (req, res, next) => {
  if (await User.findOne({ email: req.body.email }).then()) {
    res
      .status(400)
      .render("register.ejs", { msg: "This email is already used." });
  } else if (await User.findOne({ username: req.body.username }).then()) {
    res
      .status(400)
      .render("register.ejs", { msg: "This username already exists." });
  } else {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then((result) => {
            console.log(result);
          })
          .catch((err) => console.error(err));
      });
    });

    res.redirect("/login");
  }
});

router.post("/new-post", verifyToken, (req, res, next) => {
  jwt.verify(req.token, config.get("jwtSecretKey"), (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const blog = new Blog({
        title: req.body.title,
        body: req.body.desc,
        snippet: req.body.desc.split(" ").slice(0, 10).join(" "),
        postedBy: authData.user._id,
        postedByUsername: authData.user.username,
      });
      blog
        .save()
        .then((result) => console.log(result))
        .catch((err) => console.error(err));

      res.redirect("/");
      // res.json({ message: "Post created", authData });
    }
  });
});

module.exports = router;

const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOption = { secret: "mysecret", resave: false, saveUninitialized: true };
app.use(session(sessionOption));
app.use(flash());

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    console.log("hey it me reg");
    req.flash("success", "User registered successfully");
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    console.log("hey it me hello");
    res.locals.messages= req.flash("success");
    res.render("page.ejs", { name: req.session.name});
});

app.get("/test", (req, res) => {
    res.send("Test successful");
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});

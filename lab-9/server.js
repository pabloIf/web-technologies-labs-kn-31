const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const { readUsers, writeUsers } = require("./utils/db");
const { registerValidator, loginValidator } = require("./middleware/validator");
const { isAuthenticated, isNotAuthenticated } = require("./middleware/auth");
const { validationResult } = require("express-validator");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ secret: "secret123", resave: false, saveUninitialized: false }));
app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.old = req.body || {};
    next();
});

app.get("/", (req, res) => {
    if (req.session.user) return res.redirect("/dashboard");
    res.redirect("/login");
});

app.get("/register", isNotAuthenticated, (req, res) => {
    res.render("register");
});

app.post("/register", isNotAuthenticated, registerValidator, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.render("register");
    }

    const users = readUsers();
    const { name, email, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    const newUser = { id: Date.now(), name, email, password: hash };
    users.push(newUser);
    writeUsers(users);

    req.session.user = newUser;
    res.redirect("/dashboard");
});

app.get("/login", isNotAuthenticated, (req, res) => {
    res.render("login");
});

app.post("/login", isNotAuthenticated, loginValidator, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.render("login");
    }

    const users = readUsers();
    const user = users.find(u => u.email === req.body.email);

    if (!user) {
        req.flash("error", "User not found");
        return res.render("login");
    }

    const ok = bcrypt.compareSync(req.body.password, user.password);
    if (!ok) {
        req.flash("error", "Incorrect password");
        return res.render("login");
    }

    req.session.user = user;
    res.redirect("/dashboard");
});

app.get("/dashboard", isAuthenticated, (req, res) => {
    res.render("dashboard", { user: req.session.user });
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));

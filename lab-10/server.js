const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { read, write } = require('./utils/db');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}));

function isAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    return res.status(401).json({ error: "Not authenticated" });
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public/register.html')));
app.get('/dashboard', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public/dashboard.html')));

app.post('/api/register', body("email").isEmail(), body("password").isLength({ min: 4 }), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);

    const users = read('./data/users.json');
    if (users.find(u => u.email === req.body.email)) return res.status(400).json({ error: "User exists" });

    const newUser = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    };
    users.push(newUser);
    write('./data/users.json', users);
    res.json({ message: "Registered" });
});

app.post('/api/login', (req, res) => {
    const users = read('./data/users.json');
    const user = users.find(u => u.email === req.body.email);
    if (!user) return res.status(400).json({ error: "User not found" });
    if (!bcrypt.compareSync(req.body.password, user.password)) return res.status(400).json({ error: "Wrong password" });
    req.session.userId = user.id;
    res.json({ message: "Logged in" });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

app.get('/api/me', isAuthenticated, (req, res) => {
    const users = read('./data/users.json');
    const user = users.find(u => u.id === req.session.userId);
    res.json({ id: user.id, name: user.name, email: user.email });
});

app.get('/api/tasks', isAuthenticated, (req, res) => {
    const tasks = read('./data/tasks.json').filter(t => t.userId === req.session.userId);
    res.json(tasks);
});

app.post('/api/tasks', isAuthenticated, (req, res) => {
    const tasks = read('./data/tasks.json');
    const newTask = {
        id: Date.now(),
        userId: req.session.userId,
        title: req.body.title,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: req.body.priority || "medium"
    };
    tasks.push(newTask);
    write('./data/tasks.json', tasks);
    res.json(newTask);
});

app.put('/api/tasks/:id', isAuthenticated, (req, res) => {
    const tasks = read('./data/tasks.json');
    const task = tasks.find(t => t.id == req.params.id && t.userId == req.session.userId);
    if (!task) return res.status(404).json({ error: "Not found" });

    task.title = req.body.title ?? task.title;
    task.completed = req.body.completed ?? task.completed;
    task.priority = req.body.priority ?? task.priority;

    write('./data/tasks.json', tasks);
    res.json(task);
});

app.delete('/api/tasks/:id', isAuthenticated, (req, res) => {
    let tasks = read('./data/tasks.json');
    tasks = tasks.filter(t => !(t.id == req.params.id && t.userId == req.session.userId));
    write('./data/tasks.json', tasks);
    res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
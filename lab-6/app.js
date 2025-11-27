const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'data', 'users.json');

// get all users
app.get('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  res.json(users);
});

// get user by id
app.get('/api/users/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: 'Користувач не знайдений' });
  res.json(user);
});

// add new user
app.post('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };
  users.push(newUser);
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  res.status(201).json(newUser);
});

// update user
app.put('/api/users/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const userIndex = users.findIndex(u => u.id == req.params.id);
  if (userIndex === -1) return res.status(404).json({ message: 'Користувач не знайдений' });

  users[userIndex] = { ...users[userIndex], ...req.body };
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  res.json(users[userIndex]);
});

// delete user
app.delete('/api/users/:id', (req, res) => {
  let users = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const userIndex = users.findIndex(u => u.id == req.params.id);
  if (userIndex === -1) return res.status(404).json({ message: 'Користувач не знайдений' });

  const deleted = users.splice(userIndex, 1)[0];
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  res.json(deleted);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

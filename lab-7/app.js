const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'data', 'songs.json');

function readSongs() {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

function writeSongs(songs) {
  fs.writeFileSync(dataFile, JSON.stringify(songs, null, 2));
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
  next();
});

// get all songs
app.get('/api/songs', (req, res) => {
  const songs = readSongs();
  if (req.query.artist) {
    const filtered = songs.filter(s => s.artist.toLowerCase().includes(req.query.artist.toLowerCase()));
    return res.json(filtered);
  }
  res.json(songs);
});

// get song by id
app.get('/api/songs/:id', (req, res) => {
  const songs = readSongs();
  const song = songs.find(s => s.id == req.params.id);
  if (!song) return res.status(404).json({ message: 'Пісня не знайдена' });
  res.json(song);
});

// add new song
app.post('/api/songs', (req, res) => {
  const songs = readSongs();
  const newSong = {
    id: Date.now(),
    title: req.body.title,
    artist: req.body.artist
  };
  songs.push(newSong);
  writeSongs(songs);
  res.status(201).json(newSong);
});

// udate song
app.put('/api/songs/:id', (req, res) => {
  const songs = readSongs();
  const index = songs.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Пісня не знайдена' });

  songs[index] = { ...songs[index], ...req.body };
  writeSongs(songs);
  res.json(songs[index]);
});

// delete song
app.delete('/api/songs/:id', (req, res) => {
  const songs = readSongs();
  const index = songs.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Пісня не знайдена' });

  const deleted = songs.splice(index, 1)[0];
  writeSongs(songs);
  res.json(deleted);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

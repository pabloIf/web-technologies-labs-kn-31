const songList = document.getElementById('song-list');
const songForm = document.getElementById('song-form');
const btnSearch = document.getElementById('btn-search');
const searchInput = document.getElementById('search');


function loadSongs(artist = '') {
  let url = '/api/songs';
  if (artist) url += `?artist=${artist}`;

  fetch(url)
    .then(res => res.json())
    .then(songs => {
      songList.innerHTML = '';
      songs.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.title} - ${s.artist}`;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Видалити';
        delBtn.classList.add('delete');
        delBtn.onclick = () => deleteSong(s.id);
        li.appendChild(delBtn);
        songList.appendChild(li);
      });
    });
}

songForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(songForm);
  fetch('/api/songs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: formData.get('title'),
      artist: formData.get('artist')
    })
  }).then(() => {
    songForm.reset();
    loadSongs();
  });
});

function deleteSong(id) {
  fetch(`/api/songs/${id}`, { method: 'DELETE' })
    .then(() => loadSongs());
}

btnSearch.addEventListener('click', () => {
  loadSongs(searchInput.value);
});

loadSongs();

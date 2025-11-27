const userList = document.getElementById('user-list');
const userForm = document.getElementById('user-form');

function loadUsers() {
  fetch('/api/users')
    .then(res => res.json())
    .then(users => {
      userList.innerHTML = '';
      users.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `${u.name} (${u.email}) - ${u.role}`;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Видалити';
        delBtn.onclick = () => deleteUser(u.id);
        li.appendChild(delBtn);
        userList.appendChild(li);
      });
    });
}

userForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(userForm);
  fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role')
    })
  }).then(() => {
    userForm.reset();
    loadUsers();
  });
});

function deleteUser(id) {
  fetch(`/api/users/${id}`, { method: 'DELETE' })
    .then(() => loadUsers());
}

loadUsers();

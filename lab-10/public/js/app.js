document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const taskForm = document.getElementById('taskForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginForm.email.value,
                    password: loginForm.password.value
                })
            });
            const data = await res.json();
            if (data.message === "Logged in") {
                window.location = '/dashboard';
            } else {
                document.getElementById('msg').innerText = data.error;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: registerForm.name.value,
                    email: registerForm.email.value,
                    password: registerForm.password.value,
                    confirm: registerForm.confirm.value
                })
            });
            const data = await res.json();
            document.getElementById('msg').innerText = data.message || data.error;
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: taskForm.title.value,
                    priority: taskForm.priority.value
                })
            });
            const data = await res.json();
            if (!data.error) {
                renderTasks();
                taskForm.reset();
            } else {
                alert(data.error);
            }
        });
    }
});


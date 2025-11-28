document.getElementById("eventForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data)
    });

    const result = await res.json();

    const msgBox = document.getElementById("messages");
    msgBox.innerHTML = "";

    if (result.errors) {
        result.errors.forEach(err => {
            msgBox.innerHTML += `<p>${err.msg}</p>`;
        });
    } else {
        msgBox.innerHTML = `<p style="color:green">Event successfully added!</p>`;
        e.target.reset();
    }
});

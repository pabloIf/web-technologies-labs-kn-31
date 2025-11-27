const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

// main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// /time
app.get("/time", (req, res) => {
    const now = new Date().toLocaleString("uk-UA");

    fs.appendFile("log.txt", `GET /time: ${now}\n`, () => {});

    res.send(`<h1>Поточний час: ${now}</h1>`);
});

// /time/json 
app.get("/time/json", (req, res) => {
    const now = new Date();
    const data = {
        date: now.toLocaleDateString("uk-UA"),
        time: now.toLocaleTimeString("uk-UA")
    };
    res.json(data);
});

// /settime
app.post("/settime", (req, res) => {
    const { datetime } = req.body;

    fs.writeFile("custom.txt", `User datetime: ${datetime}`, () => {});
    res.send("Дата та час успішно збережено!");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

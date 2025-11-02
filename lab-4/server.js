const http = require("http");
const fs = require("fs");
const PORT = 3000;

function saveLog(path) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync("access.log", `[${timestamp}] Виклик маршруту: ${path}\n`);
}

const server = http.createServer((req, res) => {
  const now = new Date();
  const date = now.toLocaleDateString("uk-UA");
  const time = now.toLocaleTimeString("uk-UA");

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Головна сторінка сервера</h1>");
  } else if (req.url === "/info") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Про сервер</h1><p>Це Node.js сервер!</p>");
  } else if (req.url === "/datetime") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<p>Дата: ${date}</p><p>Час: ${time}</p>`);
    saveLog("/datetime");
  } else if (req.url === "/datetime/json") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ date, time }, null, 2));
    saveLog("/datetime/json");
  } else {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Сторінку не знайдено</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
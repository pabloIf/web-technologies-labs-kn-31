const fs = require("fs");

fs.readFile("notes.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const header = "Парний варіант — виконано студентом Салтиков П.Ю.\n\n";
  const result = header + data;

  console.log(result);

  fs.writeFile("text.txt", result, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("File created successfully: output_text.txt");
  });
});


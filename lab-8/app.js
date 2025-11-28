const express = require("express");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, "public")));

const DATA_PATH = path.join(__dirname, "data", "data.json");

function readData() {
    const json = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(json);
}

function writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// /submit
app.post(
    "/submit",
    [
        body("eventName")
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage("Event name must be 3–50 characters long"),

        body("location")
            .trim()
            .notEmpty()
            .withMessage("Venue is required"),

        body("eventDate")
            .isISO8601()
            .withMessage("Некоректна дата")
            .custom((value) => {
                const input = new Date(value);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                if (input < tomorrow) {
                    throw new Error("The event date must be no earlier than tomorrow.");
                }
                return true;
            }),

        body("maxParticipants")
            .isInt({ min: 1 })
            .withMessage("The maximum number of participants must be ≥ 1"),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const events = readData();

        const newEvent = {
            id: Date.now(),
            eventName: req.body.eventName,
            location: req.body.location,
            eventDate: req.body.eventDate,
            maxParticipants: Number(req.body.maxParticipants)
        };

        events.push(newEvent);
        writeData(events);

        res.json({ success: true, event: newEvent });
    }
);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

const { body } = require("express-validator");
const { readUsers } = require("../utils/db");

exports.registerValidator = [
    body("name")
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Full name to be between 3 and 30 characters"),

    body("email")
        .isEmail()
        .withMessage("Invalid email")
        .custom(value => {
            const users = readUsers();
            if (users.some(u => u.email === value)) {
                throw new Error("Email already in use");
            }
            return true;
        }),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("confirm")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
];
exports.loginValidator = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password cannot be empty")
];

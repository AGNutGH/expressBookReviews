const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => user.username === username);
    return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => (user.username === username && user.password === password));
    return validusers.length > 0;
}

// Task 7: Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'fingerprint_customer', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).json({message: "Login successful!"});
    } else {
        return res.status(208).json({ message: "Invalid Login" });
    }
});

// Task 8: Add/Modify review
regd_users.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({
            message: "Review added/updated successfully",
            reviews: books[isbn].reviews
        });
    }
    return res.status(404).json({message: "Book not found"});
});

// Task 9: Delete review
regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: "Review deleted successfully"});
    }
    return res.status(404).json({message: "Review not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
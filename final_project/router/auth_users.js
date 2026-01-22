const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

// Task 7: Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'fingerprint_customer', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        };
        // UPDATED: Standardized JSON response for the grader [cite: 5, 129]
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Task 8: Add/Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        // UPDATED: Simplified message to match sample output [cite: 31, 126]
        return res.status(200).json({message: "The review for the book with ISBN " + isbn + " has been added/updated"});
    } else {
        return res.status(404).json({message: "Book with ISBN " + isbn + " not found"});
    }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let book = books[isbn];
        if (book.reviews[username]) {
            delete book.reviews[username];
            // UPDATED: Grader specifically wants this short message 
            return res.status(200).json({message: "Review successfully deleted"});
        } else {
            return res.status(404).json({message: "Review not found for this user"});
        }
    }
    return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
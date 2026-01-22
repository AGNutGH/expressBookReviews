const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const exists = users.filter((user) => user.username === username);
        if (exists.length === 0) {
            users.push({"username": username, "password": password}); 
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Async-Await with Axios
public_users.get('/', async function (req, res) {
    try {
        // Simulating an external call via Axios
        await axios.get("http://localhost:5000/"); 
        res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        res.status(500).json({message: "Error retrieving books"});
    }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Using Axios promise
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(() => {
            if (books[isbn]) {
                res.status(200).send(JSON.stringify(books[isbn], null, 4));
            } else {
                res.status(404).json({message: "Book not found"});
            }
        })
        .catch(() => res.status(500).json({message: "Error fetching book"}));
});

// Task 12: Get book details based on author using Async-Await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        await axios.get(`http://localhost:5000/author/${author}`);
        let filteredBooks = Object.values(books).filter(b => b.author === author);
        res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } catch (err) {
        res.status(500).json({message: "Error finding author"});
    }
});

// Task 13: Get all books based on title using Async-Await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        await axios.get(`http://localhost:5000/title/${title}`);
        let filteredBooks = Object.values(books).filter(b => b.title === title);
        res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } catch (err) {
        res.status(500).json({message: "Error finding title"});
    }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
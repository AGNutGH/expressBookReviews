const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (username && password) {
      // Helper function to check if user exists
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
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Use JSON.stringify to display the books neatly 
    res.send(JSON.stringify(books, null, 4)); 
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
      res.send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; 
    const bookKeys = Object.keys(books);
    let results = [];
  
    // Iterate through the 'books' array & check if the author matches 
    bookKeys.forEach((key) => {
      if (books[key].author === author) {
        results.push(books[key]);
      }
    });
  
    if (results.length > 0) {
      res.send(JSON.stringify(results, null, 4));
    } else {
      res.status(404).json({message: "No books found by this author"});
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let results = [];
  
    bookKeys.forEach((key) => {
      if (books[key].title === title) {
        results.push(books[key]);
      }
    });
  
    if (results.length > 0) {
      res.send(JSON.stringify(results, null, 4));
    } else {
      res.status(404).json({message: "No books found with this title"});
    }
  });

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
      // Return only the reviews of that book 
      res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      res.status(404).json({message: "Book not found"});
    }
  });

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
const {username, password} = req.body;

//check 
if (!username || !password){
    return res.status(404).send({
        message : "username or password are missing"
    })
}

users[username] = { password };
return res.status(201).json({
    message: "User registered successfully",
    user: { username }
});
});

// Get the book list available in the shop

public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ message: "Books data not found" });
        }
    })
    .then((bookList) => {
        res.status(200).json({
            message: "Book list retrieved successfully",
            books: bookList
        });
    })
    .catch((error) => {
        res.status(500).json(error);
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ message: `Book with ISBN ${isbn} not found` });
        }
    })
    .then((bookDetails) => {
        res.status(200).json({
            message: "Book details retrieved successfully",
            book: bookDetails
        });
    })
    .catch((error) => {
        res.status(404).json(error);
    });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(
            book => book.author.toLowerCase() === author.toLowerCase()
        );

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ message: `No books found by author ${author}` });
        }
    })
    .then((booksByAuthor) => {
        res.status(200).json({
            message: "Books by the author retrieved successfully",
            books: booksByAuthor
        });
    })
    .catch((error) => {
        res.status(404).json(error);
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(
            book => book.title.toLowerCase() === title.toLowerCase()
        );

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ message: `No books found with title "${title}"` });
        }
    })
    .then((booksByTitle) => {
        res.status(200).json({
            message: "Books retrieved successfully by title",
            books: booksByTitle
        });
    })
    .catch((error) => {
        res.status(404).json(error);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const { isbn } = req.params; 
    if (books[isbn]) {
        return res.status(200).json({
            message: "Book details retrieved successfully",
            book: books[isbn].reviews
        });
    } else {
        return res.status(404).json({
            message: `Book with ID ${isbn} not found`
        });
    }
 });


module.exports.general = public_users;

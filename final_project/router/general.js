const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
public_users.get('/',function (req, res) {
    const response = {
        message: "Book list retrieved successfully",
        books: books
    };
    const jsonResponse = JSON.stringify(response, null, 2);
    return res.status(200).send(jsonResponse); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const { isbn } = req.params; 
    if (books[isbn]) {
        return res.status(200).json({
            message: "Book details retrieved successfully",
            book: books[isbn]
        });
    } else {
        return res.status(404).json({
            message: `Book with ID ${isbn} not found`
        });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const { author } = req.params;
    const matchingBooks = Object.keys(books)
        .map(key => books[key]) 
        .filter(book => book.author.toLowerCase() === author.toLowerCase()); 

    if (matchingBooks.length > 0) {
        return res.status(200).json({
            message: "Books by the author retrieved successfully",
            books: matchingBooks
        });
    } else {
        return res.status(404).json({
            message: `No books found by author ${author}`
        });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const { title } = req.params;
    const matchingBooks = Object.keys(books)
        .map(key => books[key]) 
        .filter(book => book.title.toLowerCase() === title.toLowerCase()); 

    if (matchingBooks.length > 0) {
        return res.status(200).json({
            message: "Books by the author retrieved successfully",
            books: matchingBooks
        });
    } else {
        return res.status(404).json({
            message: `No books found by author ${author}`
        });
    }
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

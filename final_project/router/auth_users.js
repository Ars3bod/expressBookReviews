const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = "Org-20241228";

let users = [];

const isValid = (username) => {
  //returns boolean
  const user = users.find((user) => user.username === username);
  return !!user;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );

  return !!validUser;
};


//only registered users can login
regd_users.post("/login", (req,res) => {
const  {username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required to log in"
        });
    }

    // Validate the user credentials
    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    // Store the token in the session
    req.session.token = token;

    return res.status(200).json({
        message: "Login successful",
        session: {
            token: token
        }
    });
});

regd_users.put('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;

    // Check if ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: `Book with ISBN ${isbn} not found`,
        });
    }

    // Check if user is logged in
    if (!req.session.token) {
        return res.status(401).json({
            message: "Unauthorized. Please log in to add or modify a review.",
        });
    }

    try {
        // Decode the token to get the username
        const decoded = jwt.verify(req.session.token, JWT_SECRET);
        const username = decoded.username;

        // Add or modify the review
        books[isbn].reviews[username] = review;

        return res.status(200).json({
            message: "Review added/updated successfully",
            book: books[isbn],
        });
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired session token",
        });
    }
});

regd_users.delete("/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    // Check if ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: `Book with ISBN ${isbn} not found`,
        });
    }

    // Check if user is logged in
    if (!req.session.token) {
        return res.status(401).json({
            message: "Unauthorized. Please log in to delete your review.",
        });
    }

    try {
        // Decode the token to get the username
        const decoded = jwt.verify(req.session.token, JWT_SECRET);
        const username = decoded.username;

        // Check if the user has a review for this book
        if (!books[isbn].reviews[username]) {
            return res.status(404).json({
                message: `Review by user "${username}" not found for this book.`,
            });
        }

        // Delete the user's review
        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review deleted successfully",
            book: books[isbn],
        });
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired session token",
        });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "testUser", "password": "pwd123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const userIsValid = users.filter((user) => user.username === username);
return userIsValid.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
    const matchingUsers = users.filter((user) => user.username === username && user.password === password);
    return matchingUsers.length > 0;
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
 const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
      const bookReviews = books[isbn].reviews;
       if (bookReviews[username]) {
        bookReviews[username] = reviewText;
        res.status(200).json({ message: `Review for book with ISBN: ${isbn} has been updated` });
      } else {
       
        bookReviews[username] = reviewText;
        res.status(201).json({ message: `Review added successfully for book with ISBN: ${isbn}` });
      }
    } else {
      res.status(404).json({ message: `Book not found with ISBN: ${isbn}` });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  
  if (books[isbn]) {
    const bookReviews = books[isbn].reviews;

    
    if (bookReviews[username]) {
      delete bookReviews[username];
      res.status(200).json({ message: `Review deleted successfully for ISBN: ${isbn}` });
    } else {
      res.status(404).json({ message: `No review found for ISBN: ${isbn} by user: ${username}` });
    }
  } else {
    res.status(404).json({ message: `Book not found with ISBN: ${isbn}` });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

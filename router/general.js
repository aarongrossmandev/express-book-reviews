const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// const doesExist = (username)=>{
//   let userswithsamename = users.filter((user)=>{
//     return user.username === username
//   });
//   if(userswithsamename.length > 0){
//     return true;
//   } else {
//     return false;
//   }
// }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: `User successfully registered. You can now login`})
    } else {
      return res.status(404).json({message: "User already exists"})
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop

public_users.get('/',  function (req, res) {
  async function getBooks(){
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(res.status(300).json(books));
      }, 1000)
    });
    await promise;
  }
  getBooks()
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // const isbn = req.params.isbn;
  // res.send(books[isbn])
  const ISBN = parseInt(req.params.isbn);
  async function getBookByISBN() {
    const promiseISBN = new Promise((resolve, reject) => {
      let booksISBN = {};
      booksISBN[`${ISBN}`] = books[ISBN];
      setTimeout(() => {
        resolve(res.status(300).json(booksISBN));
      }, 1000)
    });
    await promiseISBN;
  }
  getBookByISBN()

 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // const author = req.params.author;
  // const booksByAuthor = Object.values(books).filter(book => book.author === author );

  // if(booksByAuthor.length > 0){
  //   res.status(200).json(booksByAuthor);
  // } else {
  //   res.status(404).json({message: `No books found for author: ${author}`})
  // }

  const author = req.params.author;
  const booksByAuthor = {};
  async function getBooksByAuthor() {
    const promise = new Promise((resolve, reject) => {
      for (let key in books) {
        if (books[key]["author"] === author) {
          booksByAuthor[`${key}`] = books[key];
        }
      }
      resolve(res.status(300).json(booksByAuthor));
    })
    await promise;
  }
  getBooksByAuthor()
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // const title = req.params.title;
  // const booksByTitle = Object.values(books).filter(book => book.title === title);
  // if(booksByTitle.length > 0){
  //   res.status(200).json(booksByTitle);
  // } else {
  //   res.status(404).json({ message: `No books found with title containing: ${title}` });
  // }

  const title = req.params.title;
  const booksByTitle = {};
  async function getBooksByTitle(){
    const promise = new Promise((resolve, reject) => {
      for (let key in books){
        if(books[key]["title"] === title){
          booksByTitle[`${key}`] = books[key];
        }
      }
      resolve(res.status(300).json(booksByTitle));
    });
    await promise;
  }
  getBooksByTitle();
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

module.exports.general = public_users;

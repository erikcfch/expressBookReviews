const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: 'Customer successfully registered. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  /*try {
    const response = await axios.get('https://api.example.com/books');
    const books = response.data.books;
  } catch (error) {
    console.error('API call failed:', error);
    res.status(500).send('Internal Server Error');
  }*/
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  /*axios.get(`https://api.example.com/books/${isbn}`)
      .then(response => {
        books[isbn] = response.data;
        res.status(200).json(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch book data:', error);
        res.status(500).send('Unable to retrieve book data');
      });*/

  const isbn = req.params.isbn;
  const result = books[isbn];
  return res.status(200).send(JSON.stringify(result));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksbyauthor = [];
  for (let key in books) {
    let item = books[key];
    if (item.author === author) {
      const resItem = {
        isbn: key,
        author: item.author,
        title: item.title,
      };
      booksbyauthor.push(resItem);
    }
  }
  return res.status(200).send(JSON.stringify({ booksbyauthor: booksbyauthor }));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksbytitle = [];
  for (let key in books) {
    const item = books[key];
    if (item.title === title) {
      const resItem = {
        isbn: key,
        author: item.author,
        review: item.reviews,
      };
      booksbytitle.push(resItem);
    }
  }
  return res.status(200).send(JSON.stringify({ booksbytitle: booksbytitle }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const reviews = book['reviews'];
  return res.status(200).send(JSON.stringify(reviews));
});

module.exports.general = public_users;

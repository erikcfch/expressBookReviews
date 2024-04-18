const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let usersMatched = users.filter((user) => {
    return user.username === username;
  });
  return (usersMatched?.length > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return (validUsers?.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: 'Incorrect credentials' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
        { data: password },
        'access',
        { expiresIn: 60 * 60 },
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('Customer successfully logged in');
  } else {
    return res.status(401).json({ message: 'Incorrect credentials' });
  }
});

// Add a book review
regd_users.put( "/auth/review/:isbn",
    ( req, res ) => {
      //Write your code here
      const { isbn } = req.params;
      let book = books[ isbn ];
      if ( book ) {
        books[ isbn ].reviews = req.body.reviews;
        res.send(`The review for the book with ISBN ${isbn} has been added/updated!`);
      } else {
        res.send('Unable to find book!');
      }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { username } = req.session.authorization;
  let book = books[isbn];
  if (book) {
    delete books[isbn].reviews;
    res.send(
        `Reviews for the ISBN ${isbn} posted by the user ${username} deleted`
    );
  } else {
    res.send('Unable to find book!');
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

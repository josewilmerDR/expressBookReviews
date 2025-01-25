const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// let users = [];

// Function to check if the user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json({
    message: "List of books available",
    books: JSON.stringify(books, null, 2) // Convierte a JSON con formato ordenado
  });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Recupera el ISBN de los parámetros de la solicitud
  const book = books[isbn]; // Busca el libro en el objeto books

  if (book) {
    return res.status(200).json({
      message: `Details of the book with ISBN ${isbn}`,
      book: book
    });
  } else {
    return res.status(404).json({
      message: `Book with ISBN ${isbn} not found`
    });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Recupera el autor de los parámetros de la solicitud
  const booksByAuthor = []; // Inicializa un array para almacenar los libros encontrados

  // Itera sobre todas las claves del objeto 'books'
  for (const key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]); // Agrega el libro al array si el autor coincide
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json({
      message: `Books by author ${author}`,
      books: booksByAuthor
    });
  } else {
    return res.status(404).json({
      message: `No books found by author ${author}`
    });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Recupera el titulo de los parámetros de la solicitud
  const booksByTitle = []; // Inicializa un array para almacenar los libros encontrados

  // Itera sobre todas las claves del objeto 'books'
  for (const key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]); // Agrega el libro al array si el titulo coincide
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json({
      message: `Books by title ${title}`,
      books: booksByTitle
    });
  } else {
    return res.status(404).json({
      message: `No books found by title ${title}`
    });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  // const book = books[isbn]; // Find the book by ISBN

  // if (book) {
  //   return res.status(200).json({
  //     message: `Reviews for the book with ISBN ${isbn} is ${book.reviews}`,
  //     reviews: book.reviews
  //   });
  // } else {
  //   return res.status(404).json({
  //     message: `Book with ISBN ${isbn} not found`
  //   });
  // }
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Find the book by ISBN

  if (book) {
    return res.status(200).json({
      message: `Reviews for the book with ISBN ${isbn}`,
      reviews: book.reviews
    });
  } else {
    return res.status(404).json({
      message: `Book with ISBN ${isbn} not found`
    });
  }
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const cors = require('cors');
public_users.use(cors());


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
// //FUNCION SIN PROMESA
// public_users.get('/', function (req, res) {
//   //Write your code here
//   return res.status(200).json({
//     message: "List of books available",
//     books: JSON.stringify(books, null, 2) // Convierte a JSON con formato ordenado
//   });
//   // return res.status(300).json({message: "Yet to be implemented"});
// });


// 1. Ruta interna que responde con la lista de libros
public_users.get('/', (req, res) => {
  return res.status(200).json({
    message: "List of books available",
    books: books
  });
});

// 2. Ruta que consume la anterior usando axios
public_users.get('/books', (req, res) => {
  axios.get('http://localhost:5000')
    .then(response => {
      return res.status(200).json({
        message: "List of books available (via axios)",
        books: response.data.books
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: "Unable to fetch books" });
    });
});


// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn; // Recupera el ISBN de los parámetros de la solicitud
//   const book = books[isbn]; // Busca el libro en el objeto books

//   if (book) {
//     return res.status(200).json({
//       message: `Details of the book with ISBN ${isbn}`,
//       book: book
//     });
//   } else {
//     return res.status(404).json({
//       message: `Book with ISBN ${isbn} not found`
//     });
//   }
// });

//Get book details based on ISBN WITH PROMISE
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Recupera el ISBN de los parámetros de la solicitud

  axios.get(`http://localhost:5000/books/${isbn}`)
    .then(response => {
      return res.status(200).json({
        message: `Details of the book with ISBN ${isbn}`,
        book: response.data
      });
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
      } else {
        console.error(error);
        return res.status(500).json({ message: "Unable to fetch book details" });
      }
    });
});


// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author; // Recupera el autor de los parámetros de la solicitud
//   const booksByAuthor = []; // Inicializa un array para almacenar los libros encontrados

//   // Itera sobre todas las claves del objeto 'books'
//   for (const key in books) {
//     if (books[key].author.toLowerCase() === author.toLowerCase()) {
//       booksByAuthor.push(books[key]); // Agrega el libro al array si el autor coincide
//     }
//   }

//   if (booksByAuthor.length > 0) {
//     return res.status(200).json({
//       message: `Books by author ${author}`,
//       books: booksByAuthor
//     });
//   } else {
//     return res.status(404).json({
//       message: `No books found by author ${author}`
//     });
//   }
// });

// public_users.get('/books', (req, res) => {
//   return res.status(200).json({
//     message: "List of books available",
//     books: books
//   });
// });

//Get book details based on AUTHOR WITH PROMISE
// Ruta: /author/:author (con Promesa usando Axios)
// Ruta: /author/:author (con Promesa usando Axios)


public_users.get('/books/author/:author', (req, res) => {
  const author = req.params.author;

  axios.get('http://localhost:5000')
    .then(response => {
      // response.data.books debe contener el array de libros
      const allBooks = response.data.books;

      // Convertimos ese objeto en un arreglo
      const allBooksArray = Object.values(allBooks);

      // Filtramos por autor
      const booksByAuthor = allBooksArray.filter(book =>
        book.author.toLowerCase() === author.toLowerCase()
      );

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
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({
        message: "Unable to fetch books"
      });
    });
});




// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title; // Recupera el titulo de los parámetros de la solicitud
//   const booksByTitle = []; // Inicializa un array para almacenar los libros encontrados

//   // Itera sobre todas las claves del objeto 'books'
//   for (const key in books) {
//     if (books[key].title.toLowerCase() === title.toLowerCase()) {
//       booksByTitle.push(books[key]); // Agrega el libro al array si el titulo coincide
//     }
//   }

//   if (booksByTitle.length > 0) {
//     return res.status(200).json({
//       message: `Books by title ${title}`,
//       books: booksByTitle
//     });
//   } else {
//     return res.status(404).json({
//       message: `No books found by title ${title}`
//     });
//   }
// });

public_users.get('/books/title/:title', (req, res) => {
  const title = req.params.title;

  axios.get('http://localhost:5000')
    .then(response => {
      // response.data.books debe contener el array de libros
      const allBooks = response.data.books;
      //Leer el objeto de libros
      console.log(allBooks);

      // Convertimos ese objeto en un arreglo
      const allBooksArray = Object.values(allBooks);

      // Filtramos por autor
      const booksByTitle = allBooksArray.filter(book =>
        book.title.toLowerCase() === title.toLowerCase()
      );

      if (booksByTitle.length > 0) {
        return res.status(200).json({
          message: `Books by author ${title}`,
          books: booksByTitle
        });
      } else {
        return res.status(404).json({
          message: `No books found by author ${title}`
        });
      }
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({
        message: "Unable to fetch books"
      });
    });
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

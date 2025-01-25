const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}


// Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});



regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Recupera el ISBN de los parámetros
  const review = req.body.review; // Recupera la reseña del cuerpo de la solicitud
  const username = req.session.authorization?.username; // Recupera el nombre de usuario desde la sesión

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Agregar o modificar la reseña
  if (!books[isbn].reviews) {
    books[isbn].reviews = {}; // Inicializa las reseñas si no existen
  }

  books[isbn].reviews[username] = review; // Agrega o modifica la reseña del usuario

  return res.status(200).json({
    message: `Review for book with ISBN ${isbn} added/updated successfully`,
    reviews: books[isbn].reviews,
  });
});

// Ruta para eliminar una reseña
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const username = req.session.authorization?.username; // Retrieve the username from the session

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({
      message: `No review found for book with ISBN ${isbn} by user ${username}`,
    });
  }

  // Delete the review for the given user
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for book with ISBN ${isbn} by user ${username} deleted successfully`,
    reviews: books[isbn].reviews, // Return remaining reviews
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

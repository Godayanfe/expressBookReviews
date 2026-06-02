const express = require("express");
const axios = require("axios");
let books = require("./db/booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6 - Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({ message: "Username and password required" });
});

// Task 10 - Get all books using async-await with Promise
public_users.get("/", async (req, res) => {
  try {
    const getBooks = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No books found");
      }
    });
    const result = await getBooks;
    return res.status(200).json(JSON.stringify(result, null, 2));
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Task 11 - Get book by ISBN using async-await with Promise
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const getBook = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    const result = await getBook;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 12 - Get books by Author using async-await with Promise
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const matchingBooks = {};
      bookKeys.forEach((key) => {
        if (books[key].author === author) {
          matchingBooks[key] = books[key];
        }
      });
      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for this author");
      }
    });
    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13 - Get books by Title using async-await with Promise
public_users.get("/title/:titl
const express = require("express"),
  app = express(),
  http = require("http"),
  url = require("url"),
  morgan = require("morgan");

let topBooks = [
  {
    title: "Interstellar",
    author: "Christopher Nolan"
  },
  {
    title: "Django Unchained",
    author: "Quentin Tarantino"
  },
  {
    title: "Avengers: Infinity War",
    author: "Anthony Russo; Joe Russo"
  },
  {
    title: "Guardians of the Galaxy",
    author: "James Gunn"
  },
  {
    title: "Dune",
    author: "Denis Vulleneuve"
  },
  {
    title: "Red Notice",
    author: "Rawson Marshall Thurber"
  },
  {
    title: "Pulp Fiction",
    author: "Quentin Tarantino"
  },
  {
    title: "Joker",
    author: "Todd Phillips"
  },
  {
    title: "John Wick",
    author: "Chad Stahelski"
  },
  {
    title: "The Dark Knight",
    author: "Christopher Nolan"
  },
];

app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to my Movies API!");
});

// app.get("/documentation", (req, res) => {
//   res.sendFile("/public/documentation.html", {root: __dirname});
// });

app.use("/documentation", express.static('public'));

app.get("/books", (req, res) => {
  res.json(topBooks);
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.")
});

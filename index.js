const express = require("express"),
      bodyParser = require("body-parser");
      uuid = require("uuid");
      http = require("http"),
      url = require("url"),
      morgan = require("morgan"),
      mongoose = require("mongoose");

// Links model.js mongoose schema

const Models = require("./models.js"),
      Movies = Models.Movie,
      Users = Models.User;

// Connects mongoose with the DB

mongoose.connect("mongodb://localhost:27017/myFlixDB", { useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan("common"));
app.use(express.static('public'));


let users = [
  {
    id: 1,
    name: "Ethan",
    favoriteMovies: ["Django Unchained"]
  },
  {
    id: 2,
    name: "Marshall",
    favoriteMovies: []
  }
];

let movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Science fiction",
    director: {
      name: "Christopher Nolan",
      dob: "30/07/1970"
    }
  },
  {
    id: 2,
    title: "Django Unchained",
    genre: "Western",
    director: {
      name: "Quentin Tarantino",
      dob: "27/03/1963"
    }
  },
  {
    id: 3,
    title: "Avengers: Infinity War",
    genre: "Action",
    director: {
      name: "Russo Brothers",
      dob: "03/02/1970 - 18/07/1971 "
    }
  },
  {
    id: 4,
    title: "Guardians of the Galaxy",
    genre: "Action",
    director: {
      name: "James Gunn",
      dob: "05/08/1966"
    }
  },
  {
    id: 5,
    title: "Dune",
    genre: "Science fiction",
    director: {
      name: "Denis Vulleneuve",
      dob: "03/08/1967"
    }
  },
  {
    id: 6,
    title: "Red Notice",
    genre: "Comedy",
    director: {
      name: "Rawson Marshall Thurber",
      dob: "09/02/1975"
    }
  },
  {
    id: 7,
    title: "Pulp Fiction",
    genre: "Crime",
    director: {
      name: "Quentin Tarantino",
      dob: "27/03/1963"
    }
  },
  {
    id: 8,
    title: "Joker",
    genre: "Crime",
    director: {
      name: "Todd Phillips",
      dob: "20/12/1970"
    }
  },
  {
    id: 9,
    title: "John Wick",
    genre: "Action",
    director: {
      name: "Chad Stahelski",
      dob: "20/09/1968"
    }
  },
  {
    id: 10,
    title: "Fury",
    genre: "War",
    director: {
      name: "David Ayer",
      dob: "18/01/1968"
    }
  }
];

// Gets the list of data about ALL movies

app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// Gets the data about a single movie, by name

app.get("/movies/:title", (req, res) => {
  const movie = movies.find(movie => movie.title === req.params.title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("Movie with title " + req.params.title + " was not found.");
  }
});

// Gets the data about a genre, by name

app.get("/movies/genre/:genreName", (req,res) => {
  const genre = movies.find(movie => movie.genre === req.params.genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Genre with name " + req.params.genreName + " was not found.")
  }
});

// Gets the data about the director, by name

app.get("/movies/director/:directorName", (req, res) => {
    const author = movies.find(movie => movie.director.name === req.params.directorName).director;

    if (author) {
      res.status(200).json(author);
    } else {
      res.status(400).send("Director with name " + req.params.name + " was not found.");
    }
});

// Allows new user to register
/* We'll expect JSON in this format
{
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + " already exists");
    } else {
      Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Email
        })
        .then((user) => {res.status(201).json(user) })
      .catch((err) => {
        console.error(error);
        res.status(500).send("Error: " + err);
      })
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Get all users

app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get Username by name

app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Allows users to update their username
/* We´ll expect JSON in this format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/

app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => { // Alternative way for .then .catch
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user list of favorites

app.post("/user/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
  { $push: { FavoriteMovies: req.params.MovieID }},
  { new: true}, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Removes a movie from a user list of favorites

app.delete("/user/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
  { $pull: { FavoriteMovies: req.params.MovieID }},
  { new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by username

app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.Username + " was not found.");
    } else {
      res.status(200).send(req.params.Username + " was deleted.");
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Shows home page

app.get("/", (req, res) => {
  res.send("Welcome to my Movies API!");
});



// Error handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Port

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.")
});

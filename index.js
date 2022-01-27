const express = require("express"),
      bodyParser = require("body-parser");
      uuid = require("uuid");
      http = require("http"),
      url = require("url"),
      morgan = require("morgan");

const app = express();

app.use(bodyParser.json());
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

app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    res.status(400).send("Missing name in request body");
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Allows users to update their names

app.put("/users/:name/:newName", (req, res) => {
  let user = users.find((user) => {
    return user.name == req.params.name
  });

  if (user) {
    user.name = req.params.newName;
    res.status(200).send("Username " + req.params.name + " updated to " + req.params.newName + ".");
  } else {
    res.status(400).send("User with name " + req.params.name + " was not found.");
  }
});

// Allows users to add a movie to their list of favorites

app.post("/users/:name/:movieTitle", (req, res) => {
  let user = users.find((user) => {
    return user.name == req.params.name
  });

  if (user) {
    user.favoriteMovies.push(req.params.moveTitle);
    res.status(200).send("The movie " + req.params.movieTitle + " has been added to user " + req.params.name + ".");
  } else {
    res.status(400).send("User with name " + req.params.name + " was not found.");
  }
});

// Allows user to remove a movie from their list of favorites

app.delete("/users/:name/:movieTitle", (req, res) => {
  let user = users.find((user) => {
    return user.name == req.params.name
  });

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== req.params.movieTitle);
    res.status(200).send("The movie " + req.params.movieTitle + " has been removed for user " + req.params.name + ".");
  } else {
    res.status(400).send("User with name " + req.params.name + " was not found.");
  }
})

// Allows user to delete their username

app.delete("/users/:name", (req, res) => {
  let user = users.find((user) => {
    return user.name == req.params.name
  });

  if (user) {
    users = users.filter((obj) => {
      return obj.name !== req.params.name
    });
    res.status(200).send("User " + req.params.name + " has been deleted.");
  } else {
    res.status(400).send("User with name " + req.params.name + " was not found.")
  }
})

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

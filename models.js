const bcrypt = require("bcrypt"); // Hashing

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}]
});

userSchema.statucs.hashPassword = (password) => { // Hashes passwrord
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) { // Compares submitted hashed password with the hashed password stored in DB
  return bcrypt.compareSync(password, this.Password);
}

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie,
module.exports.User = User;

/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
var port = process.env.PORT|| 3010;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));
require('./routes/apiroutes')(app);
// Database configuration with mongoose on localhost
mongoose.connect("mongodb://localhost/webscraper");
// used on heroku to connect to mongoosedb
// mongoose.connect("mongodb://heroku_mjmsrvht:7q5h7df2mp6eqcmu861jfihc13@ds129315.mlab.com:29315/heroku_mjmsrvht");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

// Grab an article by it's ObjectId

// Listen on port 3000
app.listen(port, function () {
  console.log("App running on port", port);
});
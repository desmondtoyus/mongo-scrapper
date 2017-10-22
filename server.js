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

var port = process.env.PORT || 3000;
// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_mjmsrvht:7q5h7df2mp6eqcmu861jfihc13@ds129315.mlab.com:29315/heroku_mjmsrvht");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the nyt website 
app.get("/scrape", function (req, res) {
  var result = [];
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article.story.theme-summary").each(function (i, element) {
      result.push({
        title: $(this).children(".story-heading").children("a").text(),
        link: $(this).children(".story-heading").children("a").attr("href"),
        summary: $(this).children(".summary").text()
      });


    });
    res.json(result);
    // console.log(result);
  });
  // Tell the browser that we finished scraping the text
  // res.send("Scrape Complete");
});

//-save a new article
app.post("/articles/", function (req, res) {
  //Find user with userId in db
  //...
  //Find view with viewId in db
  var result = {};

  // Add the text and href of every link, and save them as properties of the result object
  result.title = req.body.title;
  result.link = req.body.link;
  result.summary = req.body.summary;
  // Using our Article model, create a new entry
  // This effectively passes the result object to the entry (and the title and link)
  var entry = new Article(result);

  // Now, save that entry to the db
  entry.save(function (err, doc) {
    // Log any errors
    if (err) {
      res.json(err);
    }
    // Or log the doc
    else {
      res.json(doc);
    }
  });

});

//USED 
// delete a saved article
app.get("/delete/:id", function (req, res) {
  // var id = req.params.id;
  // When searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))

  // Find just one result in the notes collection
  Article.remove({
    // Using the id in the url
    "_id": req.params.id
  }, function (error, found) {
    // log any errors
    if (error) {
      //  console.log(error);
      res.send(error);
    }
    // Otherwise, send the note to the browser
    // This will fire off the success function of the ajax request
    else {
      //  console.log(found);
      res.send(found);
    }
  });
});

//create a new not or update a existing note
app.post("/notes/", function (req, res) {

  Note.findOneAndUpdate({
    noteid: req.body.noteid
  }, {
    $set: {
      noteid: req.body.noteid,
      body: req.body.body
    }
  }, {
    upsert: true
  }, function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });


});

//USED to get a particular note
app.get("/notes/:id", function (req, res) {
  Note.findOne({
    noteid: req.params.id
  }, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      res.json(found);
    }
  });
});
//USED to delect a note
app.get("/deletenote/:id", function (req, res) {

  // Find just one result in the notes collection
  Note.remove({
    // Using the id in the url
    "noteid": req.params.id
  }, function (error, found) {
    // log any errors
    if (error) {
      //  console.log(error);
      res.json(error);
    }
    // Otherwise, send the note to the browser
    // This will fire off the success function of the ajax request
    else {
      //  console.log(found);
      res.json(found);
    }
  });
});


// This will get the articles we scraped from the mongoDB-USED
app.get("/articles", function (req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function (error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      // console.log(doc);
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId





// Listen on port 3000
app.listen(port, function () {
  console.log("App running on port 3000!");
});
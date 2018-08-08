// Require and initialize Express

const express = require("express");
const app = express();

// Require generateRandomString function

const generateRandomString = require('./random-string');

// Requiring body-parser npm module to parse the data returned from the
// html form

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Set the default port

const PORT = 8080;

// Set view engin to EJS

app.set('view engine', 'ejs');

// Simulate Database

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Routes

app.get("/", (req, res) => {
  res.end("Hello!");
});

// New form

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const newEntry = generateRandomString();
  urlDatabase[newEntry] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(303, `urls/${newEntry}`);
});

// Render all urls

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Render a specific url

app.get("/urls/:id", (req, res) => {
  let templateVars = {shortURL: req.params.id, urls: urlDatabase};
  res.render("urls_show", templateVars);
});

// Server starts listening on default port

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
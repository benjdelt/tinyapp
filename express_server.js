// Require and initialize Express

const express = require("express");
const app = express();

// Require generateRandomString function

const generateRandomString = require('./random-string');

// Require body-parser npm module to parse the data returned from the
// html form

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Require and use cookie-parser

const cookieParser = require("cookie-parser");
app.use(cookieParser());


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

// Login user

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect(303, '/urls');
});


// Logout user

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect(303, '/urls');
});

// Home

app.get("/", (req, res) => {
  res.end("Hello!");
});

// New form

app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies['username']};
  res.render("urls_new", templateVars);
});

// Create new shortened URL

app.post("/urls", (req, res) => {
  const newEntry = generateRandomString();
  urlDatabase[newEntry] = req.body.longURL;
  res.redirect(303, `urls/${newEntry}`);
});

// Render all urls

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase,
                      username:req.cookies["username"]
                     };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Render a specific url

app.get("/urls/:id", (req, res) => {
  let templateVars = {shortURL: req.params.id,
                      urls: urlDatabase,
                      username: req.cookies["username"]
                      };
  res.render("urls_show", templateVars);
});

// Redirect from short URL to actual URL

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(301, longURL)
});

// Update URL

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.shortURL;
  res.redirect(303, '/urls');
});

// Delete URL

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(303, '/urls');
});

// Server starts listening on default port

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
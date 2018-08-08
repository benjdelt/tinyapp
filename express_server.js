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

const urlsRouter = require('./routes/urls');
app.use('/urls', urlsRouter);

// Home

app.get("/", (req, res) => {
  res.end("Hello!");
});

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

// Redirect from short URL to actual URL

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(301, longURL)
});


// Server starts listening on default port

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
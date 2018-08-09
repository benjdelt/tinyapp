// Require and initialize Express

const express = require("express");
const app = express();

// Require generateRandomString function

const generateRandomString = require('./random-string');

// Require body-parser npm module to parse the data returned from the
// html form

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Require and use cookie session

const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['pepperoni', 'pizza']
}));


// Set the default port

const PORT = 8080;

// Set view engin to EJS

app.set('view engine', 'ejs');

// Require urlDatabase

const urlDatabase = require("./db/urls-db");

// Require users database

const users = require("./db/users-db");

// Routes

// URLs router

const urlsRouter = require('./routes/urls');
app.use('/urls', urlsRouter);

// Users router

const usersRouter = require('./routes/users')
app.use('/', usersRouter);


// Home

app.get("/", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
});


// Redirect from short URL to actual URL

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  // console.log("req.params.shortURL: ", req.params.shortURL);
  res.redirect(longURL)
});


// Server starts listening on default port

app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}`);
});
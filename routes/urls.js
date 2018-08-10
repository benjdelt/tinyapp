// Reauire and instantiate Express

const express = require('express');
const urlsRouter = new express.Router();

// Require vaild-url module

const validUrl = require('valid-url');

// Require generateRandomString function

const generateRandomString = require('../random-string');

// Require users database

const users = require('../db/users-db');

// Require urlDatabase

const urlDatabase = require('../db/urls-db');


function urlsForUser(id) {
  const result = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      result[urlDatabase[url].short] = urlDatabase[url];
    }
  }
  return result;
}

// console.log(urlsForUser("user3RandomID"));

function addUrl(fullUrl, userID) {
  const newEntry = generateRandomString();
  urlDatabase[newEntry] = {
    short: newEntry,
    longURL: fullUrl,
    userID: userID
  };
  return newEntry;
}

function updateUrl(id, fullUrl, userID) {
  urlDatabase[id] = {
    short: id,
    longURL: fullUrl,
    userID: userID
  };
}

function deleteUrl(id) {
  delete urlDatabase[id];
}

// Routes

urlsRouter

  // New form

  .get("/new", (req, res) => {
    if (!users[req.session.user_id]) {
      res.redirect('/login');
    } else {
      const templateVars = {user_id: users[req.session.user_id]};
      res.render("urls_new", templateVars);
    }
  })

  // Create new shortened URL

  .post("/", (req, res) => {
    if (!users[req.session.user_id]) {
      res.status(401).render('denied');
    } else if (!validUrl.isUri(req.body.longURL)){
      res.status(403).render('invalidurl');
    } else {
      const newEntry = addUrl(req.body.longURL, req.session.user_id);
      res.redirect(303, `urls/${newEntry}`);
    }
  })

  // Render all urls for a user

  .get("/", (req, res) => {
    const templateVars = {
      urls: urlsForUser(req.session.user_id),
      user_id: users[req.session.user_id]
      };
      res.render("urls_index", templateVars);
  })


  .get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  })

  // Render a specific url

  .get("/:id", (req, res) => {
    if (!users[req.session.user_id]) {
      res.status(401).render('denied');
    } else if (!urlDatabase[req.params.id]) {
      res.status(404).render('notfound');
    } else if (urlDatabase[req.params.id].userID !== req.session.user_id){
      res.status(401).render('denied');
    } else {
      const templateVars = {shortURL: req.params.id,
                          urls: urlDatabase[req.params.id].longURL,
                          user_id: users[req.session.user_id]
                          };
      res.render("urls_show", templateVars);
    }
  })

  // Update URL

  .post("/:id/update", (req, res) => {
    if (!users[req.session.user_id]) {
      res.status(401).render('denied');
    } else {
      updateUrl(req.params.id, req.body.shortURL, req.session.user_id);
      res.redirect(303, '/urls');
    }
  })

  // Delete URL

  .post("/:id/delete", (req, res) => {
    if (!users[req.session.user_id]) {
      res.status(401).render('denied');
    } else if (urlDatabase[req.params.id].userID !== req.session.user_id) {
      res.status(401).render('denied');
    } else {
      deleteUrl(req.params.id);
      res.redirect(303, '/urls');
    }
  });


module.exports = urlsRouter;
const express = require('express');
const urlsRouter = new express.Router();

// Require generateRandomString function

const generateRandomString = require('../random-string');

// Require users database

const users = require('../db/users-db');

// Require urlDatabase

const urlDatabase = require('../db/urls-db');


function addUrl(fullUrl, userID) {
  const newEntry = generateRandomString();
  urlDatabase[newEntry] = {
                          longURL: fullUrl,
                          userID: userID
                          };
}

function updateUrl(id, fullUrl, userID) {
  urlDatabase[id] = {
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
    if (!users[req.cookies['user_id']]) {
      res.redirect('/login');
    } else {
      let templateVars = {user_id: users[req.cookies['user_id']]};
      res.render("urls_new", templateVars);
    }
  })

  // Create new shortened URL

  .post("/", (req, res) => {
    addUrl(req.body.longURL, req.cookies['user_id']);
    res.redirect(303, `urls/${newEntry}`);
  })

  // Render all urls

  .get("/", (req, res) => {
    let templateVars = {urls: urlDatabase,
                        user_id: users[req.cookies['user_id']]
                       };
    res.render("urls_index", templateVars);
  })

  .get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  })

  // Render a specific url

  .get("/:id", (req, res) => {
    if (!users[req.cookies['user_id']]) {
      res.redirect('/login');
    } else {
      let templateVars = {shortURL: req.params.id,
                          urls: urlDatabase[req.params.id].longURL,
                          user_id: users[req.cookies['user_id']]
                          };
      console.log(templateVars);
      res.render("urls_show", templateVars);
    }
  })

  // Update URL

  .post("/:id/update", (req, res) => {
    updateUrl(req.params.id, req.body.shortURL, req.cookies['user_id']);
    res.redirect(303, '/urls');
  })

  // Delete URL

  .post("/:id/delete", (req, res) => {
    deleteUrl(req.params.id);
    res.redirect(303, '/urls');
  });


module.exports = urlsRouter;
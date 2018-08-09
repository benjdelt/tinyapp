const express = require('express');
const urlsRouter = new express.Router();


// Require urlDatabase

const urlDatabase = require('../db/urls-db');

// Require users database

const users = require('../db/users-db');


// Require generateRandomString function

const generateRandomString = require('../random-string');

// Routes

urlsRouter

  // New form

  .get("/new", (req, res) => {
    let templateVars = {user_id: users[req.cookies['user_id']]};
    console.log(templateVars);
    res.render("urls_new", templateVars);
  })

  // Create new shortened URL

  .post("/", (req, res) => {
    const newEntry = generateRandomString();
    urlDatabase[newEntry] = req.body.longURL;
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
    let templateVars = {shortURL: req.params.id,
                        urls: urlDatabase,
                        user_id: users[req.cookies['user_id']]
                        };
    res.render("urls_show", templateVars);
  })

  // Update URL

  .post("/:id/update", (req, res) => {
    urlDatabase[req.params.id] = req.body.shortURL;
    res.redirect(303, '/urls');
  })

  // Delete URL

  .post("/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect(303, '/urls');
  });


module.exports = urlsRouter;
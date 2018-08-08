const express = require('express');
const urlsRouter = new express.Router();

// Simulate Database

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Routes

urlsRouter

  // New form

  .get("/new", (req, res) => {
    let templateVars = {username: req.cookies['username']};
    res.render("urls_new", templateVars);
  })

  // Create new shortened URL

  .post("/urls", (req, res) => {
    const newEntry = generateRandomString();
    urlDatabase[newEntry] = req.body.longURL;
    res.redirect(303, `urls/${newEntry}`);
  })

  // Render all urls

  .get("/", (req, res) => {
    let templateVars = {urls: urlDatabase,
                        username:req.cookies["username"]
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
                        username: req.cookies["username"]
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
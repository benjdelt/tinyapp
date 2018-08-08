const express = require('express');
const usersRouter = new express.Router();

// Simulate Database

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


// Routes

usersRouter

  // Create user

  .get('/register', (req, res) => {
    res.render('register');
  })

  // Login user

  .post('/login', (req, res) => {
    res.cookie('username', req.body.username);
    res.redirect(303, '/urls');
  })


  // Logout user

  .post("/logout", (req, res) => {
    res.clearCookie('username');
    res.redirect(303, '/urls');
  });


module.exports = usersRouter;
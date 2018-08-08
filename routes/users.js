// Require Express and set router

const express = require('express');
const usersRouter = new express.Router();

// Require generateRandomString function

const generateRandomString = require('../random-string');


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

function createUser(email, password) {
  const randomID = generateRandomString();
  users[randomID] = {
                    id: randomID,
                    email: email,
                    password:password
                   };
  return randomID;
}

function getUserByEmail(email) {
  for (user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
  return false;
}


// Routes

usersRouter

  // Create user page

  .get('/register', (req, res) => {
    res.render('register');
  })

  // Create user

  .post('/register', (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.sendStatus(400); // Why not use 403?
    } else if (getUserByEmail(req.body.email)) {
      res.sendStatus(400); // Why not use 403?
    } else {
      const userID = createUser(req.body.email, req.body.password);
      res.cookie('user_id', userID);
      res.redirect(303, '/urls');
    }
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
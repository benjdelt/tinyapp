// Require Express and set router

const express = require('express');
const usersRouter = new express.Router();

// Require generateRandomString function

const generateRandomString = require('../random-string');

// Require users databse

const users = require('../db/users-db');



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

  // Login page

  .get('/login', (req, res) => {
    res.render('login');
  })

  // Login user

  .post('/login', (req, res) => {
    const registeredUser = getUserByEmail(req.body.email);
    if (!registeredUser) {
      res.sendStatus(403);
    } else if (req.body.password !== users[registeredUser].password) {
      console.log("wrong password", users[registeredUser].password);
      res.sendStatus(403);
    } else {
      res.cookie('user_id', registeredUser);
      res.redirect(303, '/');
    }
  })


  // Logout user

  .post("/logout", (req, res) => {
    res.clearCookie('username');
    res.redirect(303, '/urls');
  });


module.exports = usersRouter;
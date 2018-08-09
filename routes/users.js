// Require Express and set router

const express = require('express');
const usersRouter = new express.Router();

// Require generateRandomString function

const generateRandomString = require('../random-string');

// Require bcrypt to hash passwords

const bcrypt = require('bcrypt');

// Require users databse

const users = require('../db/users-db');



function createUser(email, password) {
  const randomID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[randomID] = {
                    id: randomID,
                    email: email,
                    password: hashedPassword
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
      // res.cookie('user_id', userID);
      req.session.user_id = userID;
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
    // } else if (req.body.password !== users[registeredUser].password) {
    } else if (!bcrypt.compareSync(req.body.password, users[registeredUser].password)) {
      res.sendStatus(403);
    } else {
      // res.cookie('user_id', registeredUser);
      req.session.user_id = registeredUser;
      res.redirect(303, '/');
    }
  })


  // Logout user

  .post("/logout", (req, res) => {
    // res.clearCookie('user_id');
    req.session = null;
    res.redirect(303, '/urls');
  });


module.exports = usersRouter;
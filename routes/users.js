// Require Express and set router

const express = require('express');
const usersRouter = new express.Router();

// Require generateRandomString function

const generateRandomString = require('../random-string');

// Require bcrypt to hash passwords

const bcrypt = require('bcrypt');

// Require users databse

const users = require('../db/users-db');

// Database functions

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
  for (let user in users) {
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
    if (!users[req.session.user_id]) {
      res.render('register');
    } else {
      res.redirect('/urls');
    }
  })

  // Create user

  .post('/register', (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.status(400).render('registerempty');
    } else if (getUserByEmail(req.body.email)) {
      res.status(403).render('registertaken');
    } else {
      const userID = createUser(req.body.email, req.body.password);
      req.session.user_id = userID;
      res.redirect(303, '/urls');
    }
  })

  // Login page

  .get('/login', (req, res) => {
    if (!users[req.session.user_id]) {
      res.render('login');
    } else {
      res.redirect('/urls');
    }
  })

  // Login user

  .post('/login', (req, res) => {
    const registeredUser = getUserByEmail(req.body.email);
    if (!registeredUser) {
      res.status(401).render('loginerror');
    } else if (!bcrypt.compareSync(req.body.password, users[registeredUser].password)) {
      res.status(401).render('loginerror');
    } else {
      req.session.user_id = registeredUser;
      res.redirect(303, '/');
    }
  })


  // Logout user

  .post("/logout", (req, res) => {
    req.session = null;
    res.redirect(303, '/urls');
  });


module.exports = usersRouter;
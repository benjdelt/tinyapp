const express = require('express');
const usersRouter = new express.Router();

// Routes

usersRouter

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
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});

router.post('/signup', (req, res, next) => {
 const { username, email, password, password2 } = req.body
 let errors = [];

 if(password !== password2) {
  errors.push({ msg: "password do not match" });
}

if(password.length < 6) {
  errors.push({ msg: "password should at least 6 characters" });
}

if(errors.length > 0) {
  res.render('users/signup', {
    errors,
    username,
    email,
    password,
    password2
  });
} else {
  User.findOne({ email: email })
  .then(user => {
    if(user) {
      errors.push({ msg: "Email is already in use" });
      res.render('users/signup', {
        errors,
        username,
        email,
        password,
        password2
      });
    } else {
      const newUser = new User({
        username,
        email,
        password
      });
      //Hash password
      bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        newUser.save()
        .then(user => {
          console.log(newUser);
          req.flash("success", "You are registerd and can login");
          res.redirect("/users/login");
        })
        .catch((err => console.log(err)));
      }));
    }
  });
}
});


router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true 
  })(req, res, next)
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
  req.flash('success', "Logged you out");
});

module.exports = router;

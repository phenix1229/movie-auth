const express = require('express');
const router = express.Router();
const User = require('./models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const responseLine = ['You are now registered'];
require('../lib/passport');


//validation middleware
const myValidation = (req, res, next) => {
  if(!req.body.name || !req.body.email || !req.body.password){
    return res.status(403).json({message:'All fields must be filled'});
  }
  next();
};

//register with passport
router.post('/register', myValidation, (req, res) => {
  //check if user exists
  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      return res.status(400).json({message:'User already exists'});
    };
    const newUser = new User();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = hash;
    newUser.save()
    .then(user => {
      return req.login(user, (err) => {
        if(err){
          return res.status(500).json({message:'Server error', err});
        } else {
          console.log('register ', req.session);
          res.redirect('/success');
        }
      });
    })
    .catch(err => res.status(400).json({message:'User not saved', err}))
  })
  .catch(err => res.status(500).json({message:'Server error', err}));
});

//render register page
router.get('/register', (req, res) => {
  return res.render('register');
});

//login with passport
router.post('/login',
  //authenticate using local login from passport file
  passport.authenticate('local-login', {
    successRedirect:'/success',
    failureRedirect:'/fail',
    failureFlash: true
  })
);

//render login page
router.get('/login', (req, res) => {
  res.render('login');
})

//render success page
router.get('/success', (req, res) => {
  if(req.isAuthenticated()){
    return res.render('success');
  } else {
    res.send('Unauthorized');
  }
});

router.get('/fail', (req, res) => {
  return res.render('fail');
});

//update user
router.put('/update/:id', (req, res) => {
  User.findById(req.params.id)
  .then((user) => {
    if(user){
      user.name = req.body.name ? req.body.name : user.name;
      user.email = req.body.email ? req.body.email : user.email;
      user.save()
      .then((user) => {
        return res.status(200).json({message:'User updated', user});
      })
      .catch(err => res.status(400).json({message:'User not updated', err}));
    }
  })
  .catch(err => res.status(500).json({message:'User not found', err}));
})

//logout user
router.get('/logout', (req, res) => {
  req.session.destroy();
  console.log('logout ', req.session)
  req.logout();
  return res.redirect('/');
});


module.exports = router;
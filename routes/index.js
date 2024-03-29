var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { error:req.flash('error')});
});

router.get('/register', function(req, res, next) {
  res.render('register',{error: req.flash('error')});
});

router.get('/profile', isLoggedIn,function(req, res, next) {
  res.render('profile');
});

router.post('/register',function(req,res,next){

  if (!req.body.dob || !req.body.name || !req.body.email || !req.body.password) {
    req.flash('error', 'All fields are required');
    return res.redirect('/register');
  }

  const userData = new userModel({  
    username:req.body.username,
    name:req.body.name,
    dob:req.body.dob,
    email:req.body.email,
  });

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
  .catch(function (err) {
    // Handle registration failure (e.g., username/email already taken)
    req.flash('error', 'Registration failed. Please choose a different username or email.');
    res.redirect('/register');
  });
});

router.post('/login', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
  failureFlash:true
}), function(req,res){
});

router.get('/logout', function(req,res,next){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;

var express = require('express');
var router = express.Router();
var User = require('../model/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
   
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var mobile = req.body.mobile;
  var group = req.body.group;
  var mentor = req.body.mentor;

  req.checkBody('name', "Input your name").notEmpty();
  req.checkBody('email', "Input your mail").isEmail();
  req.checkBody('password', "Input your password").notEmpty();
  req.checkBody('mobile', "Input your number").notEmpty();
  req.checkBody('group', "Input your group name").notEmpty();
  req.checkBody('mentor', "Input your mentor name").notEmpty();

  var errors = req.validationErrors();

  if (errors) {
  	res.render('register', {
  		errors : errors
  	})
  } else{ var newUser = User({
		  	name : name,
		  	email : email,
		  	password : password,
		  	mobile : mobile,
		  	group : group,
		  	mentor : mentor
		  });

		  User.createUser(newUser, function(err, user) {

		  	if (err) throw err;
		  	console.log(user)

		  });

		  req.flash('success_msg', 'successfully registerd and can now login')
		  res.redirect('/users/login')
		  	
		  }


});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
    	if (err) throw err;

    	if (!user) {
    		return done(null, false, {message: 'unknown user'})
    	}

    	User.comparePassword(password, user.password, function(err, isMatch){
    		if (err) throw err;

    		if (isMatch) {
    			return done(null, user)
    		} else{
    			return done(null, false, {message: 'Invalid password'})

    		}

    	})

    	
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login'/*, passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect : '/users/login', failureFlash : true})*/,
  function(req, res) {

  	res.redirect('/dashboard')
   
  });

router.get('/logout', function(req, res) {
  req.logout();

  req.flash('success_msg', 'you are logged out');

  res.redirect('/');


});




module.exports = router;

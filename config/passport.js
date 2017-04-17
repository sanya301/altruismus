'use strict';

/*!
 * Module dependencies.
 */
var LocalStrategy = require('passport-local').Strategy;  
var ousers = require('../model/ousers');

module.exports = function(passport) {  
  passport.serializeUser(function(ouser, done) {
    done(null, ouser.id);
    console.log('starting customer session');
  });
  passport.deserializeUser(function(id, done) {
    ousers.findById(id, function(err, ouser) {
      done(err, ouser);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    nameField: 'name',
    passwordField: 'password',
    emailField: 'email',
    addressField: 'address',
    phoneField: 'phone',
    confirmpasswordField: 'confirmpassword',
    isLogin: false,
    passReqToCallback: true,
  },
  function(req, name, password, email, address, phone, confirmpassword, done) {
    process.nextTick(function() {
      ousers.findOne({ 'local.email':  email }, function(err, ouser) {
        if (err)
            return done(err);
        if (ouser) {
          return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
        } 
      //  else if (password!=confirmpassword){
      //    return done(null, false, req.flash('signupMessage', 'The passwords do not match.'));
      //  }
        else {
          var newUser = new ousers();
          newUser.local.email = email;
          newUser.local.name = name;
          newUser.local.address = address;
          newUser.local.phone = phone;
        //  newUser.local.confirmpassword = confirmpassword;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            console.log("ins");
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    isLogin: true,
    emailField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    
  },
  
  function(req, name, password, email, address, phone, confirmpassword, done) {
    ousers.findOne({ 'local.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, user);
    });
  }));
};
 
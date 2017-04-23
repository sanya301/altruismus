'use strict';

/*!
 * Module dependencies.
 */
var ousers = require('../model/ousers');
var vusers = require('../model/vusers');

var LocalStrategy = require('../modules_edit/passport-local').oStrategy;
var VolLocalStrategy = require('../modules_edit/passport-local').vStrategy;  

      console.log('In passport.js now');

module.exports = function(passport) { 
  
  if (user == "o") {
        console.log('In function o of (passport)');
        

  passport.serializeUser(function(ouser, done) {
            console.log('passport.serializeUser(function(ouser, done)');

    done(null, ouser.id);
    console.log('starting customer session');
  });
  passport.deserializeUser(function(id, done) {
            console.log('passport.deserializeUser(function(ouser, done)');

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
    console.log('here');
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
          console.log('creating new org user here');
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
            console.log('ousers.findone');

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
  }
  
  else {
  
 //   console.log ('in else in passport.js', user);
      console.log('In function v of (passport)');
    



  passport.serializeUser(function(vuser, done) {
            console.log('passport.serializeUser(function(vuser, done)');

    done(null, vuser.id);
    console.log('starting customer session');
  });
  passport.deserializeUser(function(id, done) {
            console.log('passport.deserializeUser(function(vuser, done)');

    vusers.findById(id, function(err, vuser) {
      done(err, vuser);
    });
  });

  passport.use('local-signup', new VolLocalStrategy({
    firstnameField: 'firstname',
    lastnameField: 'lastname',
    passwordField: 'password',
    emailField: 'email',
    dobField: 'dob',
    confirmpasswordField: 'confirmpassword',
    isLogin: false,
    passReqToCallback: true,
  },
  function(req, firstname, lastname, password, email, dob, confirmpassword, done) {
    console.log('here');
    process.nextTick(function() {
      vusers.findOne({ 'local.email':  email }, function(err, vuser) {
        if (err)
            return done(err);
        if (vuser) {
          return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
        } 
      //  else if (password!=confirmpassword){
      //    return done(null, false, req.flash('signupMessage', 'The passwords do not match.'));
      //  }
        else {
          console.log('creating new volunteer user here');
          var newVUser = new vusers();
          newVUser.local.firstname = firstname;
          newVUser.local.lastname = lastname;
          newVUser.local.email = email;
          newVUser.local.dob = dob;
        //  newUser.local.confirmpassword = confirmpassword;
          newVUser.local.password = newVUser.generateHash(password);
          newVUser.save(function(err) {
            if (err)
              throw err;
            console.log("ins");
            return done(null, newVUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new VolLocalStrategy({
    isLogin: true,
    emailField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    
  },
  
  function(req, firstname, lastname, password, email, dob, confirmpassword, done) {
            console.log('vusers.findone');

    vusers.findOne({ 'local.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, user);
    });
  }));
  }
};




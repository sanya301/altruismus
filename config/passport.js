'use strict';

/*!
 * Module dependencies.
 */
var ousers = require('../model/ousers');
var vusers = require('../model/vusers');

var OrgLocalStrategy = require('../modules_edit/passport-local').oStrategy;
var VolLocalStrategy = require('../modules_edit/passport-local').vStrategy;  

module.exports = function(passport) { 
  
  if (usertype == "o") {

    passport.serializeUser(function(ouser, done) {
      done(null, ouser.id);
      console.log('starting organization customer', ouser.id, 'session');
    });
    passport.deserializeUser(function(id, done) {
      ousers.findById(id, function(err, ouser) {
      done(err, ouser);
     });
    });

    passport.use('local-signup', new OrgLocalStrategy({
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
          else {
            console.log('creating new org user here');
            var newUser = new ousers();
            newUser.local.email = email;
            newUser.local.name = name;
            newUser.local.address = address;
            newUser.local.phone = phone;
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

    passport.use('local-login', new OrgLocalStrategy({
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
  }
  
  else {
    passport.serializeUser(function(vuser, done) {

      done(null, vuser.id);
      console.log('starting volunteer customer', vuser.id, 'session');
    });
    passport.deserializeUser(function(id, done) {
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
      process.nextTick(function() {
        vusers.findOne({ 'local.email':  email }, function(err, vuser) {
          if (err)
              return done(err);
          if (vuser) {
            return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
          } 
          else {
            var newVUser = new vusers();
            newVUser.local.firstname = firstname;
            newVUser.local.lastname = lastname;
            newVUser.local.email = email;
            newVUser.local.dob = dob;
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
/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  , BadRequestError = require('./errors/badrequesterror');


/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Applications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `usernameField`  field name where the username is found, defaults to _username_
 *   - `passwordField`  field name where the password is found, defaults to _password_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new LocalStrategy(
 *       function(username, password, done) {
 *         User.findOne({ username: username, password: password }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
 
 console.log('the user in vstrategy.js rn is', user)

 
        console.log('In vstrategy now');


function vStrategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) throw new Error('local authentication strategy requires a verify function');
  
  this._passwordField = options.passwordField || 'password';
  this._emailField = options.emailField || 'email'; 
  this._confirmpasswordField = options.confirmpasswordField || 'confirmpassword'; 
  this._firstnameField = options.firstnameField || 'firstname'; 
  this._lastnameField = options.lastnameField || 'lastname'; 
  this._dobField = options.dobField || 'dob'; 

  passport.Strategy.call(this);
  this.name = 'local';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
  this._isLogin = options.isLogin;
}


 
util.inherits(vStrategy, passport.Strategy);


vStrategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var firstname = lookup(req.body, this._firstnameField) || lookup(req.query, this._firstnameField);
  var lastname = lookup(req.body, this._lastnameField) || lookup(req.query, this._lastnameField);
  var password = lookup(req.body, this._passwordField) || lookup(req.query, this._passwordField);
  var email = lookup(req.body, this._emailField) || lookup(req.query, this._emailField);
  var dob = lookup(req.body, this._dobField) || lookup(req.query, this._dobField);
  var confirmpassword = lookup(req.body, this._confirmpasswordField) || lookup(req.query, this._confirmpasswordField);
  
  var wut = this; 
  
  if (wut._isLogin && (!password || !email)) {
     console.log('Not all volunteer fields filled');
    return this.fail(new BadRequestError(options.badRequestMessage || 'Missing credentials'));
  }
  
  else if (wut._isLogin == false && (!password || !email || !firstname || !lastname || !dob || !confirmpassword)) {
    console.log('Not all volunteer fields filled');
    return this.fail(new BadRequestError(options.badRequestMessage || 'Missing credentials'));
  }
  
  else if (wut._isLogin == false && (password != confirmpassword)) {
    console.log('Volunteer Passwords do not match');
    return this.fail(new BadRequestError(options.badRequestMessage || 'Unmatched Passwords'));
  }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }
  
  if (self._passReqToCallback) {
    this._verify(req, firstname, lastname, password, email, dob, confirmpassword, verified);
  } else {
    this._verify(firstname, lastname, password, email, dob, confirmpassword, verified);
  }
  
  function lookup(obj, field) {
    if (!obj) { return null; }
    var chain = field.split(']').join('').split('[');
    for (var i = 0, len = chain.length; i < len; i++) {
      var prop = obj[chain[i]];
      if (typeof(prop) === 'undefined') { return null; }
      if (typeof(prop) !== 'object') { return prop; }
      obj = prop;
    }
    return null;
  }
};

module.exports = vStrategy;



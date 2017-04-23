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
 
 console.log('the user in ostrategy.js rn is', user)

function oStrategy(options, verify) {
      console.log('In ostrategy now');

  if (typeof options == 'function') {
          console.log('verifying options in ostrategy now');

    verify = options;
    options = {};
  }
  if (!verify) throw new Error('local authentication strategy requires a verify function');
  
  this._passwordField = options.passwordField || 'password';
  this._emailField = options.emailField || 'email'; 
  this._confirmpasswordField = options.confirmpasswordField || 'confirmpassword'; 
  this._addressField = options.addressField || 'address'; 
  this._phoneField = options.phoneField || 'phone'; 
  this._nameField = options.nameField || 'name'; 
  
  

  passport.Strategy.call(this);
        console.log('calling passport.srategy now');

  this.name = 'local';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
  this._isLogin = options.isLogin;
}

/**
 * Inherit from `passport.Strategy`.
 */
 
       console.log('Inheriting from passport.srategy  into ostrategy now');

util.inherits(oStrategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
oStrategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var name = lookup(req.body, this._nameField) || lookup(req.query, this._nameField);
  var password = lookup(req.body, this._passwordField) || lookup(req.query, this._passwordField);
  var email = lookup(req.body, this._emailField) || lookup(req.query, this._emailField);
  var address = lookup(req.body, this._addressField) || lookup(req.query, this._addressField);
  var phone= lookup(req.body, this._phoneField) || lookup(req.query, this._phoneField);
  var confirmpassword = lookup(req.body, this._confirmpasswordField) || lookup(req.query, this._confirmpasswordField);
  
  var wut = this; 
  
  if (wut._isLogin && (!password || !email)) {
     console.log('Not all org fields filled');
    return this.fail(new BadRequestError(options.badRequestMessage || 'Missing credentials'));
  }
  
  else if (wut._isLogin == false && (!password || !email || !name || !address || !phone || !confirmpassword)) {
    console.log('Not all org fields filled');
    return this.fail(new BadRequestError(options.badRequestMessage || 'Missing credentials'));
  }
  
  else if (wut._isLogin == false && (password != confirmpassword)) {
    console.log('Org Passwords do not match');
    return this.fail(new BadRequestError(options.badRequestMessage || 'Unmatched Passwords'));
  }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }
  
  if (self._passReqToCallback) {
    this._verify(req, name, password, email, address, phone, confirmpassword, verified);
  } else {
    this._verify(name, password, email, address, phone, confirmpassword, verified);
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
/**
 * Expose `Strategy`.
 */ 
module.exports = oStrategy;



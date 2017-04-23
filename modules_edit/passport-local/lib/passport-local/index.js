/**
 * Module dependencies.
 */
var vStrategy = require('./vstrategy')
   ,oStrategy = require('./ostrategy')
  , BadRequestError = require('./errors/badrequesterror');
  
/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */

exports.vStrategy = vStrategy;
exports.oStrategy = oStrategy;

exports.BadRequestError = BadRequestError;

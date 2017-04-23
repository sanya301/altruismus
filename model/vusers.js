var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var vusersSchema  = mongoose.Schema({
    local:{
    "firstname" : String,
    "lastname"  : String,
    "dob" : Date,
    "email" : String,
    "password" : String,
    "confirmpassword" : String
    }
});

vusersSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
vusersSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('volunteer_users',vusersSchema);

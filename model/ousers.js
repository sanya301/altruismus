var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var ousersSchema  = mongoose.Schema({
    local:{
    "name" : String,
    "address" : String,
    "phone" : Number,
    "email" : String,
    "password" : String,
    "confirmpassword" : String
    }
});

ousersSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
ousersSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('organization_users',ousersSchema);
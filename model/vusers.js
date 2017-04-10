var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var vusersSchema  = {
    "firstname" : String,
    "lastname"  : String,
    "dob" : Date,
    "email" : String,
    "password" : String,
    "confirmpassword" : String
};

module.exports = mongoose.model('volunteer_users',vusersSchema);
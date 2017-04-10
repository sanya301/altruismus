var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var ousersSchema  = {
    "name" : String,
    "address" : Date,
    "phone_no" : Number,
    "email" : String,
    "password" : String,
    "confirmpassword" : String
};

module.exports = mongoose.model('organization_users',ousersSchema);
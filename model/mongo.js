var mongoose = require('mongoose');

//mongoose.connect('mongodb://a1:altruismus1@ds157380.mlab.com:57380/altruismus'); 

var mongoSchema = mongoose.Schema;

var vusersSchema  = {
    "firstname" : String,
    "lastname"  : String,
    "dob" : Date,
    "email" : String,
    "password" : String,
    "confirmpassword" : String
};

module.exports = mongoose.model('vusers.ejs',vusersSchema);
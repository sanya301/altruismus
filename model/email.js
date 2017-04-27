var mongoose = require('mongoose');

var emailSchema  = mongoose.Schema({
    "email" : String,
});

module.exports = mongoose.model('email-list',emailSchema);
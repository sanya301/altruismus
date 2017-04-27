var mongoose = require('mongoose');

var eventsSchema  = mongoose.Schema({
    "eventname" : String,
    "location" : String,
    "date" : Date,
    "timefrom" : String,
    "timeto" : String,
    "message": String,
    "org_id" : String,
    "volunteer_ids" : { type : Array , "default" : [] },
    "no_of_volunteers": { type : Number , "default" : 0 }
});
module.exports = mongoose.model('events',eventsSchema);

/*
var events = mongoose.model('events', eventsSchema);

exports.showEvents = function (req, res) {
    var org = req.user.id;
    console.log('in shwoevents ', org);
    events.find({'org_id': org},function (err, orgevents) {
      if (!err) {
        res.render('oview', { 'org_name': req.user.name, 
                                'name': orgevents.eventname,
                                'timefrom': orgevents.timefrom,
                                'timeto': orgevents.timeto,
                                'location': orgevents.location,
                                'date': orgevents.date,});
        console.log('rendered');
      }
    });
};



exports.eventlist = function eventlist(id, callback) {  
  var Events = mongoose.model('events');
  Events.find({
    'org_id': id
  }, function(err, events) {
    if (err) {
      console.log(err);
    } else {
      callback("", events);
    }
  }); 
};*/
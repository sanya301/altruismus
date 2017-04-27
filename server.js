// Set up ===========================================================================================================

var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var MONGODB_URI = require('./config/database.js');

var eventdata = require('./model/events');


usertype = "o"; /*global-user*/

/*// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  window.alert (reason);
  res.status(code || 500).json({"error": message});
}
*/

// set up express
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true})); // get information from html forms

// set the view engine to ejs
app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/static'));


// Routes =======================================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configure
//require("./model/vusers")(app,passport);
//require("./model/ousers")(app,passport);

// Configuration ===========================================================================================================
 mongoose.connect(MONGODB_URI.url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  
  console.log("Database connection ready" + database);

  // Initialize the app.
    app.listen(port, function() {
     	console.log('Our app is running on http://localhost:' + port);
  });
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Routes ===================================================================================================================-


// set the home page route
app.get('/', function(req, res) {
  	res.render('index');
 });
 
// set the index page route
app.get('/index', function(req, res) {
	res.render('index');
}); 

// set the contact page route
app.get('/contact', function(req, res) {
    res.render('contact');
});

// set the generic signup page route
app.get('/signup', function(req, res) {
 	res.render('signup');
});

//set the vsignup page route
app.get('/vsignup', function(req, res) {
    usertype = "v";
    require('./config/passport')(passport); 
 	res.render('vsignup');
 });

// set the organization signup page route
app.get('/osignup', function(req, res) {
    usertype = "o";
    require('./config/passport')(passport); 
 	res.render('osignup');
 });

// set the login page route
app.get('/login', function(req, res) {

	// ejs render automatically looks in the views folder
	//require('./config/passport')(passport); 
	res.render('login');
});

// set the org view page route
app.get('/ologin', function(req, res) {
    
    usertype = "o";
    require('./config/passport')(passport); 
 	res.render('ologin');
});

// set the org view page route
app.get('/vlogin', function(req, res) {
     usertype = "v";
    require('./config/passport')(passport); 
 	res.render('vlogin');
});

// set the org view page route
app.get('/oview', function(req, res) {
 	res.render('oview');
});

// set the volunteer view page route
app.get('/vview', function(req, res) {
 	res.render('vview');
});


// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/login');
}

// set the add event page route
app.get('/addevent', function(req, res) {
//    require('./config/passport')(passport); 
	res.render('addevent');
});

app.post('/addevent', ensureAuthenticated, function(req, res, next) {
    
    var mongoOp     =   require("./model/events");

    var db = new mongoOp();
  
    var response = {};
    // fetch email and password from REST request.
    // Add strict validation when you use this in Production.
    db.eventname = req.body.eventname;
    db.date = req.body.date;
    db.timefrom = req.body.timefrom;
    db.timeto = req.body.timeto;
    db.location = req.body.location;
    db.message = req.body.message;
    db.org_id = req.user.id;

 
    db.save(function(err){
        
      if(err) {
            response = {"error" : true,"message" : "Error adding data"};
      } 
      
      else if (db.name == 0 || db.location == 0 || db.date == 0 || db.timefrom == 0 || db.timeto == 0 || db.message == 0) {
            response = {"error" : true,"message" : "Not all fields filled"};
      }
      
      else {
            response = {"error" : false,"message" : "Data added"};
      }
      
      res.json(response);
      
      res.redirect('/oview');

    }); 
 //   return next ();
    
}); 

// set the find new event page route
app.get('/find-new-event', function(req, res) {

	res.render('events');
});

// ABOUT PAGE 
app.get('/about', function(req, res) {
    res.render('about'); // load the about file
});

app.post("/osignup", passport.authenticate('local-signup', { 
  successRedirect: '/oview',
  failureRedirect: '/osignup',
  failureFlash: true
}));

app.post("/vsignup", passport.authenticate('local-signup', {  
  successRedirect: '/vview',
  failureRedirect: '/vsignup',
  failureFlash: true
}));

app.post('/ologin', passport.authenticate('local-login', {
  successRedirect: '/oview',
  failureRedirect: '/login',
  failureFlash: true,
})); 

app.post('/vlogin', passport.authenticate('local-login', {
    successRedirect: '/vview',
    failureRedirect: '/login',
    failureFlash: true,
}));

app.get('/logout', function(req, res){
    console.log("LOGGIN OUT " + req.user.id)
    req.logout();
  res.redirect('/');
});

app.post('/email-list', function(req, res){
    
    var mongoOp     =   require("./model/email");
    var db = new mongoOp();
    var response = {};
    // fetch email and password from REST request.
    // Add strict validation when you use this in Production.

    db.email = req.body.email;

    db.save(function(err){
        
      if(err) {
            response = {"error" : true,"message" : "Error adding data"};
      } 
      
      else if (db.email == 0) {
            response = {"error" : true,"message" : "Nothing entered"};
      }
      
      else {
            response = {"error" : false,"message" : "Data added"};
      }
      
      res.json(response);
      
      res.redirect('/thank-you');
    });
});

app.get('/thank-you', function(req, res) {
    res.render('thanks');
});

app.get('/eventlist', ensureAuthenticated, function(req, res, next) {
    var db = req.db;
    var collection = db.get('events');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
var orgdata = require('./model/ousers'); 



function loadUserEvents(req, res, next) {
  var org = req.user.id;
  eventdata.find({org}).or([
    {eventname:res.locals.eventname}])
    .exec (function(err, events) {
    if (!err) {
      res.locals.events = events;
    }
    next();
  });
}



exports.oview = function(req, res, next) {
   var org = req.user.id;
   eventdata.orgeventlist(org, function(err, orgeventlist) {
     res.render('oview', {
       events: orgeventlist
     });
   });
 };

*/
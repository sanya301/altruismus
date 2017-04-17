// Set up ===========================================================================================================

var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;  
var flash = require('connect-flash');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var MONGODB_URI = require('./config/database.js');


/*// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  window.alert (reason);
  res.status(code || 500).json({"error": message});
}
*/

require('./config/passport')(passport); //pass passport for configuration

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

// set the home page route
app.get('/', function(req, res) {
  
  // ejs render automatically looks in the views folder
	res.render('index');
 });

// set the contact page route
app.get('/contact', function(req, res) {

    res.render('contact');
});

// set the index page route
app.get('/index', function(req, res) {
	res.render('index');
});

// set the volunteer signup page route
app.get('/vsignup', function(req, res) {

 	res.render('vsignup');
 });

// set the organization signup page route
app.get('/osignup', function(req, res) {

 	res.render('osignup');
 });

// set the login page route
app.get('/login', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('login');
});

app.post('/login', function(req, res) {
    
    var logintype = req.body.logintype;
    console.log (logintype);
    
    if (logintype == 0) {
      console.log ('starting vol session');
      passport.authenticate('local-login', { 

      successRedirect: '/vview',
      failureRedirect: '/login',
      failureFlash: true,
    });
    }
    
    else if (logintype == 1) {
            console.log ('starting org session');

      passport.authenticate('local-login', { 

      successRedirect: '/oview',
      failureRedirect: '/login',
      failureFlash: true,
    });
    }
    
    else 
      res.redirect('/');

});


// set the org view page route
app.get('/oview', function(req, res) {

 	res.render('oview');
});

// ABOUT PAGE 
app.get('/about', function(req, res) {
    res.render('about'); // load the about file
});

app.post("/vsignup", function(req, res) {
    
    
    var mongoOp     =   require("./model/vusers");

    var db = new mongoOp();
  
    var response = {};
    // fetch email and password from REST request.
    // Add strict validation when you use this in Production.
    db.email = req.body.email; 
    db.firstname = req.body.firstname;
    db.lastname = req.body.lastname;
    db.dob = req.body.dob;
    // Hash the password using SHA1 algorithm.
    db.password =  require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
    db.confirmpassword =  require('crypto')
                          .createHash('sha1')
                          .update(req.body.confirmpassword)
                          .digest('base64');
    db.save(function(err){
    // save() will run insert() command of MongoDB.
    // it will add new data in collection.
      if(err) {
            response = {"error" : true,"message" : "Error adding data"};
      } 
      
      else if (db.password !== db.confirmpassword ) {
            response = {"error" : true,"message" : "Passwords don't match"};
      }
      
      
      else {
            response = {"error" : false,"message" : "Data added"};
      }
      res.json(response);
      
      res.redirect('/');

    });
});
    
app.post("/osignup", passport.authenticate('local-signup', {  
  successRedirect: '/oview',
  failureRedirect: '/osignup',
  failureFlash: true
}));

app.get('/oview', isLoggedIn, function(req, res) {  
  res.render('oview.ejs', { user: req.user });
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

 // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

/*
// Middleware that loads a users tasks if they are logged in.
function loadUserTasks(req, res, next) {
  // Removed
  next();
}

// Return the home page after loading tasks for users, or not.
app.get('/', loadUserTasks, (req, res) => {
  res.render('index');
});

// Handle submitted form for new users
app.post('/user/register', (req, res) => {
  res.send('woot');
});

app.post('/user/login', (req, res) => {
  res.send('woot');
});

// Log a user out
app.get('/user/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//  All the controllers and routes below this require
//  the user to be logged in.
app.use(isLoggedIn);

// Handle submission of new task form
app.post('/tasks/:id/:action(complete|incomplete)', (req, res) => {
  res.send('woot');
});

app.post('/tasks/:id/delete', (req, res) => {
  res.send('woot');
});

// Handle submission of new task form
app.post('/task/create', (req, res) => {
  res.send('woot');
}); */
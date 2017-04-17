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

// Configuration ===========================================================================================================
 mongoose.connect(MONGODB_URI.url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  
  // Save database object from the callback for reuse.
  //db = database;
  console.log("Database connection ready" + database);

  // Initialize the app.
    app.listen(port, function() {
     	console.log('Our app is running on http://localhost:' + port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

//mongoose.connect(MONGODB_URI.url); // connects to the database

// require('./config/passport')(passport); //pass passport for configuration

// set up express
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true})); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Routes =======================================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configure


// Launch =======================================================================================
//app.listen(port, function() {
//	console.log('Our app is running on http://localhost:' + port);
//});

// OLD CODE BELOW  =======================================================================================
// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/static'));

// set the view engine to ejs
app.set('view engine', 'ejs');



// // set the home page route
app.get('/', function(req, res) {

// // 	// ejs render automatically looks in the views folder
	res.render('index');
 });

// // set the contact page route
app.get('/contact', function(req, res) {

    res.render('contact');
});

// // set the index page route
app.get('/index', function(req, res) {
	res.render('index');
});

// // set the elements page route
app.get('/elements', function(req, res) {

 	res.render('elements');
 });

// // set the generic page route
app.get('/generic', function(req, res) {

 	res.render('generic');
 });


// // set the generic page route
app.get('/vsignup', function(req, res) {

 	res.render('vsignup');
 });

// // set the generic page route
app.get('/osignup', function(req, res) {

 	res.render('osignup');
 });

// set the login page route
app.get('/login', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('login');
});

// set the userview page route
app.get('/oview', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('oview');
});

// set the userview page route
app.get('/addevent', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('addevent');
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
      
      else if (db.password != db.confirmpassword ) {
            response = {"error" : true,"message" : "Passwords don't match"};
      }
      
      
      else {
            response = {"error" : false,"message" : "Data added"};
      }
      res.json(response);
      
      
      res.redirect('/');

    });
});
    
app.post("/osignup", function(req, res) {
    
        
    var mongoOp     =   require("./model/ousers");

    var db = new mongoOp();
  
    var response = {};
    // fetch email and password from REST request.
    // Add strict validation when you use this in Production.
    db.email = req.body.email; 
    db.name = req.body.name;
    // Hash the password using SHA1 algorithm.
    db.password =  require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
    db.confirmpassword =  require('crypto')
                          .createHash('sha1')
                          .update(req.body.confirmpassword)
                          .digest('base64');
    db.phone_no = req.body.tel;

    db.save(function(err){
    // save() will run insert() command of MongoDB.
    // it will add new data in collection.
      if(err) {
            response = {"error" : true,"message" : "Error adding data"};
      } 
      
      else if (db.password != db.confirmpassword ) {
            response = {"error" : true,"message" : "Passwords don't match"};
      }
      
      else {
            response = {"error" : false,"message" : "Data added"};
      }
      res.json(response);
      
      res.redirect('/');

    });
});
    
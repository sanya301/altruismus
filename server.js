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

var configDB = require('./config/database.js');

// Configuration ===========================================================================================================
mongoose.connect(configDB.url); // connects to the database

// require('./config/passport')(passport); //pass passport for configuration

// set up express
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Routes =======================================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configure


// Launch =======================================================================================
app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});

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
app.get('/contact.ejs', function(req, res) {

    res.render('contact');
});

// // set the index page route
app.get('/index.ejs', function(req, res) {
	res.render('index');
});

// // set the elements page route
app.get('/elements.ejs', function(req, res) {

 	res.render('elements');
 });

// // set the generic page route
app.get('/generic.ejs', function(req, res) {

 	res.render('generic');
 });


// // set the generic page route
app.get('/vsignup.ejs', function(req, res) {

 	res.render('vsignup');
 });

// // set the generic page route
app.get('/osignup.ejs', function(req, res) {

 	res.render('osignup');
 });

// set the login page route
app.get('/login.ejs', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('login');
});

// set the userview page route
app.get('/userview.ejs', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('userview');
});

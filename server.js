var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/static'));

// set the home page route
app.get('/', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');
});

// set the contact page route
app.get('/contact.ejs', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('contact');
});

// set the index page route
app.get('/index.ejs', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');
});

// set the elements page route
app.get('/elements.ejs', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('elements');
});

// set the generic page route
app.get('/generic.ejs', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('generic');
});


// set the generic page route
app.get('/vsignup.ejs', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('vsignup');
});

// set the generic page route
app.get('/osignup.ejs', function(req, res) {

	// ejs render automatically looks in the views folder
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

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});
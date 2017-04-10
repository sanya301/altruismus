module.exports = function(app, passport) {

// LANDING PAGE (with login/signup links)

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
    
// LOGIN PAGE
 app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    
// SIGN UP PAGE (V)
app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('vsignup.ejs', { message: req.flash('signupMessage') });
    });
    
// SIGN UP PAGE (O)
app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('osignup.ejs', { message: req.flash('signupMessage') });
    });
    
// ABOUT PAGE 
    app.get('/about', function(req, res) {
        res.render('index.ejs'); // load the about.ejs file
    });
    
// PROFILE
 app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

// LOGOUT
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

 // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


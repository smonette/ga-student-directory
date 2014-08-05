var express = require('express'),
    db = require('./models/index.js'),
    bodyParser = require('body-parser'),
    passport= require("passport"),
    pasportLocal = require("passport-local"),
    cookieParser = require("cookie-parser"),
    cookieSession = require("cookie-session"),
    _ = require('lodash'),
    OAuth = require('oauth'),
    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}) );
app.use( cookieSession({
    secret: 'thisismysecretkey', 
    name: 'cookie created by steph',
    maxage: 360000
}) );

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

// prepare our serialize
passport.serializeUser(function(user,done){
  done(null, user.id);
});
passport.deserializeUser(function(id,done){
  // make sure that the ids match
  db.user.find({
    where: {
      id: id
    }
  }).done(function(error, user){
    // the only time you can do this is after you've already logged in a user
    done(error, user);
  })
});








// SITE FILES

app.get('/', function (req, res) {
  res.render('site/index');
});

app.get('/about', function (req, res) {
  res.render('site/about');
});

app.get('/login', function (req, res) {
  res.render('site/login');
});

// SIGN UP & LOGIN

app.post('/create', function(req,res){
  // have to call my create new user functions
  db.user.createNewUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password,
    function(err){
      res.render("site/index", { message: err.message, email: req.body.email})
    },
    function(success){
      res.render('site/login', {message: success.message, email:req.body.email});
    });

});

// USER FILES
app.get('/edit', function (req, res) {
  res.render('user/edit');
});


// ERROR PAGE

app.get('/*', function (req, res) {
  res.render('site/error');
});




app.listen(8888, function(){
  console.log("~ * ~ * ~ * ~ * ~ * ~ *  started on port 8888   * ~ * ~ * ~ * ~ * ~ * ~");
});

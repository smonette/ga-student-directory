var express = require('express'),
    db = require('./models/index.js'),
    bodyParser = require('body-parser'),
    passport= require("passport"),
    pasportLocal = require("passport-local"),
    cookieParser = require("cookie-parser"),
    cookieSession = require("cookie-session"),
    _ = require('lodash'),
    OAuth = require('oauth'),
    flash = require('connect-flash'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}) );
app.use( cookieSession({
    secret: 'thisismysecretkey', 
    name: 'cookie created by steph',
    maxage: 360000
}) );

// get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .done(function(error,user){ 
      done(error, user);
    });
});








// SITE FILES

app.get('/', function (req, res) {
    if(!req.user){
     res.render('site/index', {message: null, username:''});
  } else {
    res.render('site/home');
  }
});

app.get('/about', function (req, res) {
  res.render('site/about');
});

app.get('/login', function (req, res) {
  if(!req.user){
   res.render('site/login', {message: null, username:''});
} else {
  res.render('site/home');
}
});

app.get('/home', function (req, res) {
  if(!req.user){
     res.render('site/login', {message: null, username:''});
  } else {
    res.render('site/home');
  }
});

// POSTS FOR SIGN UP, LOGIN & EDIT PROFILE

app.post('/create', function(req,res){
  // have to call my create new user functions
  db.user.createNewUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password,
    function(err){
      res.render("site/index", { message: err.message, email: req.body.email});
    },
    function(success){
      res.render('site/login', {message: success.message, email:req.body.email});
    });

});

app.post('/login', passport.authenticate('local', {
  //no req and res. we dont need to because passport is doing the heavy lifting with local  
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

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

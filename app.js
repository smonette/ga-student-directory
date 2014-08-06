var express = require('express'),
    db = require('./models/index.js'),
    bodyParser = require('body-parser'),
    methodOverride = require("method-override"),
    passport= require("passport"),
    pasportLocal = require("passport-local"),
    cookieParser = require("cookie-parser"),
    cookieSession = require("cookie-session"),
    _ = require('lodash'),
    OAuth = require('oauth'),
    flash = require('connect-flash'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.use(methodOverride("_method"));

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

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/login')
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


app.put('/edit/:id', function(req,res){
  // find the user by id grab from url
  // make sure only the user can change their profile 

    db.user.find({
      where: {
        id: req.params.id
      }
    })
    .success(function(foundUser){
      console.log(req.body.bio);

      foundUser.updateAttributes ( {
        website: req.body.website, 
        twitterhandle: req.body.twitterhandle, 
        linkedin: req.body.linkedin, 
        bio: req.body.bio, 
        samplework: req.body.addlinfo 
      } )
    })
    .success(function(user){
      console.log(user)
      res.redirect('/user/' + Number(req.params.id) );
    });


});

// USER FILES






app.get('/user/:id', function (req, res) {

    db.user.find({
      where: {
        id: req.params.id
      }
    })
    .success(function(foundUser) {
      res.render("user/profile", 
        { isAuthenticated: req.isAuthenticated(),
          user: foundUser
        });
   });


});


app.get('/edit/:id', function (req, res) {

  var id = req.params.id;
  db.user.find(id)
  .success(function(foundUser){
    console.log(foundUser.bio);

      res.render('user/edit', 
        { id: foundUser.id,
        firstname: foundUser.firstname, 
        lastname: foundUser.lastname, 
        email: foundUser.email, 
        website: foundUser.website || " ", 
        twitterhandle: foundUser.twitterhandle || "", 
        linkedin: foundUser.linkedin || "", 
        bio: foundUser.bio || "", 
        addlinfo: foundUser.samplework || "", 
        isAuthenticated: req.isAuthenticated()
        
      })
  })

});


// ERROR PAGE

app.get('/*', function (req, res) {
  res.render('site/error');
});




app.listen(8888, function(){
  console.log("~ * ~ * ~ * ~ * ~ * ~ *  started on port 8888   * ~ * ~ * ~ * ~ * ~ * ~");
});

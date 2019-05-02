require('dotenv').config()
var express = require("express"),
    app = express(),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    LocalStrategy = require('passport-local').Strategy,
    Strats = require('./services/passport'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    database = require('./db/dbSetup')(mongoose),
    indexRoutes = require('./rutas');

var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.set("view engine","ejs");
app.use(flash());
app.use(express.static('./public'));
// app.use(cookieParser);
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use( 'local', Strats.local);

passport.serializeUser( Strats.serial);
passport.deserializeUser( Strats.deserial);

app.use(function(req,res, next) {
	res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success")
	next();
})

// Routers
app.use('/', indexRoutes)

// Listener
app.listen(PORT, () => {
  console.log(`${ process.env.PROJECT_NAME } API on port ${ PORT }`)
})
require('dotenv').config()
var express = require("express"),
    app = express(),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    database = require('./db/dbSetup')(mongoose),
    Usuario = require('./db/modelos/usuario'),
    indexRoutes = require('./rutas/index');

var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}))
app.use(logger('dev'))
app.set("view engine","ejs");
app.use(flash());
app.use(express.static('./public'));

app.use(require("express-session")({
	secret: "This time Jaina will win because she is a very cute cat.",
	resave: false,
	saveUninitialized: false
}));


passport.initialize();
passport.use(new LocalStrategy( Usuario.authenticate()));

passport.serializeUser( Usuario.serializeUser() );
passport.deserializeUser( Usuario.deserializeUser() );

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
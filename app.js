require('dotenv').config()
var express = require("express"),
    app = express(),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    LocalStrategy = require('passport-local').Strategy,
    Strats = require('./services/passport'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    database = require('./db/dbSetup')(mongoose),
    indexRoutes = require('./rutas/index'),
    authRoutes = require('./rutas/auth'),
    instRoutes = require('./rutas/institucion'),
    sedesRoutes = require('./rutas/sede'),
    cursoRoutes = require('./rutas/curso'),
    adminsedesRoutes = require('./rutas/admin'),
    teacherRoutes = require('./rutas/teacher'),
    grupoRoutes = require('./rutas/grupo'),
    alumnaRoutes = require('./rutas/alumna'),
    Institucion = require('./db/modelos/institucion'),
    Sede = require('./db/modelos/sede'),
    { errorHandler } = require('./services/middleware');

var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.set("view engine","ejs");
app.use(flash());
app.use(express.static('./public'));
// app.use(cookieParser);
app.use(methodOverride("_method"))
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

app.use(async function(req,res, next) {
  res.locals.currentUser = req.user;
  if(res.locals.currentUser && res.locals.currentUser.tipo == "Administrador" && res.locals.currentUser.adminType != "MIT"){
    if(res.locals.currentUser.adminType == "Institución"){
      // console.log('res.locals.currentUser.institucion :', res.locals.currentUser.institucion);
      res.locals.currentUser.inst = await Institucion.findById(res.locals.currentUser.institucion).exec();
    } else {
      res.locals.currentUser.sed = await Sede.findById(res.locals.currentUser.sede).exec();
      res.locals.currentUser.inst  = await res.locals.currentUser.sed.getInstitucion();
    }
  }
  // console.log('res.locals.currentUser :', res.locals.currentUser);
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success")
	next();
})

// Routers
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/instituciones', instRoutes);
app.use('/instituciones/:instId/sedes',sedesRoutes);
app.use('/sedes', adminsedesRoutes);
app.use('/instructoras',teacherRoutes);
app.use('/cursos', cursoRoutes);
app.use('/instituciones/:instId/sedes/:sedeId/grupos', grupoRoutes);
app.use('/instituciones/:instId/sedes/:sedeId/alumnas', alumnaRoutes);
app.use(errorHandler);

// Listener
app.listen(PORT, () => {
  console.log(`${ process.env.PROJECT_NAME } API on port ${ PORT }`)
})
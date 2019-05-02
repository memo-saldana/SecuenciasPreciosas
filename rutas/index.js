var express = require("express"),
    router = express.Router(),
    aH = require('express-async-handler'),
    passport = require('passport'),
    Alumna = require('../db/modelos/alumna'),
    Instructora = require('../db/modelos/instructora'),
    Administrador = require('../db/modelos/administrador'),
    { isMITAdmin, isLoggedIn , isAdmin} = require('../services/middleware');

router.get("/", (req,res) =>{
  res.render('landing')
})

router.get("/register/alumna", (req,res) => {
  res.render("alumna/register")
})
router.post("/register/alumna", aH(async (req,res) => {
   
  let alumna =  new Alumna({
    email: req.body.email,
    password: req.body.password,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    nombre: req.body.nombre,
    nombreTutor: req.body.nombreTutor,
    telefonoTutor: req.body.telefonoTutor,
    gradoEscolar: req.body.gradoEscolar,
    cartaPermiso: req.body.cartaPermiso
  })
  alumna.save();
  return res.redirect("/")
}))

router.get("/register/instructora", (req,res) => {
  res.render("instructora/register")
})
router.post("/register/instructora", aH(async (req,res) => {
   
  let instructor = new Instructora({
    email: req.body.email,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    password: req.body.password,
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    sedePreferencia: req.body.sedePreferencia,

  }) 
  instructor.save()
  return res.redirect("/")
}))

router.get("/register/administrador", (req,res) => {
  return res.render("administrador/register");
})
router.post("/register/administrador", isMITAdmin, aH(async (req,res) => {
   
  await Administrador.register( new Administrador({
    email: req.body.email,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    institucion: req.body.institucion,
    adminType: req.body.adminType
  }), 
  req.body.password);
  return res.redirect("/")
}))

router.get('/login', (req,res) => {
  if(req.isUnauthenticated()){
    res.render('login')
  } else {
    if(req.user.tipo === "Alumna"){
      return res.redirect("/curso")
    } else if(req.user.tipo === "Instructora"){
      return res.redirect("/grupo")
    } else if(req.user.tipo ==="Administrador"){
      return res.sredirect("/adminPanel")
    }
  }
})

router.post('/login',passport.authenticate("local",
  {
    failureRedirect: "/login",
    failureFlash: true
  }),(req,res) => {
  console.log("Success");
  
  if(req.user.tipo === "Alumna"){
    return res.redirect("/curso")
  } else if(req.user.tipo === "Instructora"){
    return res.redirect("/grupo")
  } else if(req.user.tipo ==="Administrador"){
    return res.sredirect("/adminPanel")
  }
})

router.get("/logout", function(req,res) {
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/");
})

router.get('/curso', isLoggedIn, (req,res) => {
  res.render('alumna/curso');
})

router.get('/grupo', isLoggedIn, (req,res) => {
  res.render('instructora/grupo');
})

router.get('/adminPanel', isAdmin, (req,res) => {
  res.render('administrador/panel');
})




module.exports = router;
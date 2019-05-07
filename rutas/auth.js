const express = require("express"),
      router = express.Router({mergeParams: true}),
      aH = require('express-async-handler'),
      passport = require('passport'),
      Alumna = require('../db/modelos/alumna'),
      Instructora = require('../db/modelos/instructora'),
      Institucion = require('../db/modelos/institucion'),
      Sede = require('../db/modelos/sede'),
      Administrador = require('../db/modelos/administrador'),
      { isMITAdmin, isLoggedIn , isAdmin, hasRegisterToken } = require('../services/middleware');

router.get('/register',(req,res) => {
  res.render('register');
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
  await instructor.save()
  return res.redirect("/")
}))

router.get("/register/administrador", aH(async (req,res) => {
  return res.render("administrador/register")
}))

router.post("/register/administrador", aH(async (req,res) => {
   
  let admin =  new Administrador({
    email: req.body.email,
    password: req.body.password,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    adminType: req.body.adminType
  })
  await admin.save();
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
      return res.redirect("/adminPanel")
    }
  }
})

router.post('/login',passport.authenticate("local",
  {
    failureRedirect: "/login",
    failureFlash: true
  }), aH(async(req,res) => {
  console.log("Success");
  
  if(req.user.tipo === "Alumna"){
    return res.redirect("/curso")
  } else if(req.user.tipo === "Instructora"){
    return res.redirect("/grupo")
  } else if(req.user.tipo ==="Administrador"){
    if(req.user.adminType == "MIT"){
      console.log("MIT logging in");
     return res.redirect("/adminPanel")
    }
    else if(req.user.adminType == "Institución"){
      console.log("Inst logging in");
      return res.redirect("/instituciones/"+req.user.institucion);
    } 
    else {
      console.log("Inst logging in");
      const sede = await Sede.find({_id: req.user.sede}).exec();
      const inst = sede.getInstitucion();
      res.redirect('/instituciones/'+inst._id+"/sedes/"+sede._id);
    }
  }
}))

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

router.get('/adminPanel', isMITAdmin, (req,res) => {
  res.render('administrador/panel');
})




module.exports = router;
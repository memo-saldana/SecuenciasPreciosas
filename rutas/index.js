var express = require("express"),
    router = express.Router(),
    aH = require('express-async-handler'),
    passport = require('passport'),
    Alumna = require('../db/modelos/alumna');

router.get("/", (req,res) =>{
  res.render('landing')
})

router.get("/register/alumna", (req,res) => {
  res.render("register")
})
router.post("/register/alumna", aH(async (req,res) => {
   
  await Alumna.register( new Alumna({
    email: req.body.email,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    nombre: req.body.nombre,
    nombreTutor: req.body.nombreTutor,
    telefonoTutor: req.body.telefonoTutor,
    gradoEscolar: req.body.gradoEscolar,
    cartaPermiso: req.body.cartaPermiso
  }), 
  req.body.password);
  return res.redirect("/")
}))



module.exports = router;
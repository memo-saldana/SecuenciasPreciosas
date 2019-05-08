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

router.get('/', isMITAdmin, aH( async (req,res,next) => {
  const teachers = await Instructora.find({ aceptada: false }).populate('sedePreferencia').exec();
  console.log('teachers :', teachers);
  res.render('instructora/accept', {instructoras:teachers});
}))



router.post('/:id',isMITAdmin, aH(async (req,res,next) => {
  const teacher = await Instructora.findByIdAndUpdate(req.params.id, { aceptada: true, sedeActual: req.body.sedeActual }).exec();
  req.flash('success', "Se acepto la maestra exitosamente!")
  res.redirect('/instructoras');
}))


module.exports = router;
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

router.get('/', isMITAdmin, aH(async (req,res,next) => {
  const teachers = await Instructora.find({aceptada: true}).populate('sedeActual').exec();
  res.render('instructora/index', {instructoras: teachers});
}))

router.get('/accept', isMITAdmin, aH( async (req,res,next) => {
  const teachers = await Instructora.find({ aceptada: false }).populate('sedePreferencia').exec();
  console.log('teachers :', teachers);
  res.render('instructora/accept', {instructoras:teachers});
}))


router.post('/:id',isMITAdmin, aH(async (req,res,next) => {
  const teacher = await Instructora.findByIdAndUpdate(req.params.id, { aceptada: true, sedeActual: req.body.sedeActual }).exec();
  req.flash('success', "Se acepto la maestra exitosamente!")
  res.redirect('/instructoras');
}))

router.get('/:id/editSede',isMITAdmin, aH(async (req,res,next) => {
  const teacher = await Instructora.findById(req.params.id).populate('sedeActual').exec();
  const sedes = await Sede.find({aceptada: true}).exec();
  console.log('teacher :', teacher);
  console.log('sedes :', sedes);
  res.render('instructora/editSede', {instructora: teacher, sedes: sedes});
}))


module.exports = router;
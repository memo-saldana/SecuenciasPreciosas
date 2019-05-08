const express = require('express'),
      router = express.Router(),
      mailer = require('../services/mailer'),
      {isMITAdmin, isInstitucionAdmin } = require('../services/middleware'),
      Sede = require('../db/modelos/sede'),
      Institucion = require('../db/modelos/institucion'),
      aH = require('express-async-handler');


router.get('/',isMITAdmin, aH(async (req,res,next) => {
  const sedes = await Sede.find({aceptada: false}).exec();

  res.render('sede/accept', {sedes});
}))


router.post('/:id',isMITAdmin, aH(async (req,res,next) => {
  const sede = await Sede.findByIdAndUpdate(req.params.id, { aceptada: true }).exec();
  req.flash('success', "Se acepto la sede exitosamente!")
  res.redirect('/sedes');
}))




module.exports = router;
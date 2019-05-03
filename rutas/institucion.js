const express = require('express'),
      router = express.Router(),
      mailer = require('../services/mailer'),
      {isMITAdmin} = require('../services/middleware'),
      Sede = require('../db/modelos/sede'),
      Institucion = require('../db/modelos/institucion'),
      aH = require('express-async-handler');


router.get('/', isMITAdmin, aH (async (req,res) => {
  const insts = await Institucion.find({})
  res.render('institucion/index', {instituciones: insts});
}))

router.get('/new',isMITAdmin, (req,res) => {
  res.render('institucion/new')
})

router.post('/',isMITAdmin, aH(async (req,res,next) => {
  let inst = new Institucion({
    nombre: req.body.nombre
  })
  await inst.save();
  res.redirect('/instituciones')
}))

router.get('/:instId', isMITAdmin, aH( async (req,res,next) => {
  let inst = await Institucion.findById(req.params.instId).populate('sedes').exec();

  res.render('institucion/show', { institucion: inst});
}))

router.get('/admin/new', isMITAdmin, (req,res) => {
  res.render('institucion/newAdmin');
})

router.post('/admin/new', isMITAdmin, aH( async (req,res,next) => {
  const {email} = req.body;
  // gen token
  console.log('posted');
  
  await mailer.sendInvInst(email, "123");
  req.flash("success", "El correo se envio exitosamente")
  res.redirect('/adminPanel')
}))
module.exports = router;
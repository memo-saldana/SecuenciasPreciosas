const express = require('express'),
      router = express.Router(),
      mailer = require('../services/mailer'),
      {isMITAdmin, isInstitucionAdmin } = require('../services/middleware'),
      Sede = require('../db/modelos/sede'),
      Administrador = require('../db/modelos/administrador'),
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
    nombre: req.body.nombreInst
  })
  await inst.save();
  let admin =  new Administrador({
    email: req.body.email,
    password: req.body.password,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    adminType: "Institución",
    institucion: inst._id
  })
  await admin.save();
  res.redirect('/instituciones')
}))

router.get('/:instId', isInstitucionAdmin, aH( async (req,res,next) => {
  console.log('req.params.instId :', req.params.instId);
  let inst = await Institucion.findById(req.params.instId).populate('sedes').exec();
  // console.log('inst :', inst);
  if(!inst){
    req.flash("error", "No se encontró la institución.")
    return res.redirect('/')
  } 
  res.render('institucion/show', { institucion: inst});
}))

router.get('/new/invite', isMITAdmin, (req,res) => {
  res.render('institucion/invite');
})

router.post('/new/invite', isMITAdmin, aH( async (req,res,next) => {
  const {email} = req.body;
  // gen token
  console.log('posted');
  
  await mailer.sendInvInst(email, "Institución");
  req.flash("success", "El correo se envio exitosamente")
  res.redirect('/adminPanel')
}))
module.exports = router;
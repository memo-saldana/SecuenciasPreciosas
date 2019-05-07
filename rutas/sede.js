const express = require('express'),
      router = express.Router({mergeParams:true}),
      mailer = require('../services/mailer'),
      { isInstitucionAdmin, isAdmin} = require('../services/middleware'),
      Administrador = require('../db/modelos/administrador'),
      Sede = require('../db/modelos/sede'),
      Institucion = require('../db/modelos/institucion'),
      aH = require('express-async-handler');

router.get('/', isInstitucionAdmin, (req,res) => {
  res.render('sede/index')

})

router.get('/new', aH( async (req,res,next) => {
    const inst = await Institucion.findById(req.params.instId).exec();
    return res.render("sede/new", { institucion:inst });
}))

router.get('/:sedeId', isAdmin, (req,res) => {
  res.render('sede/show')
})

router.get('/new/invite', aH( async (req,res) => {
  const instId = req.params.instId;
  console.log('instId :', instId);
  const institucion = await Institucion.findById(instId).exec();
  console.log('institucion :', institucion);
  res.render('sede/invite', { institucion:institucion } )
}))

router.post('/admin/new',aH(async (req,res) => {
  const { email } = req.body;
  const { instId } = req.params;

  mailer.sendInvSede(email, instId);
  req.flash("success", "Se envió el correo exitosamente.")
  res.redirect("/");
}))
router.post('/', aH( async (req,res,next) => {
  const inst = await Institucion.findById(req.params.instId).exec()
  let sede = new Sede({
      nombre: req.body.nombreSede,
      cupo: req.body.cupo,
      direccion: req.body.direccion,
      telefono: req.body.telefonoSede
    })
    await sede.save();

  let admin =  new Administrador({
    email: req.body.email,
    password: req.body.password,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    adminType: req.query.token,
    sede: sede._id
  })
  await admin.save();

  inst.register(sede);
  
  res.redirect('/instituciones/'+req.params.instId)
}))





module.exports = router;
const express = require('express'),
      router = express.Router({mergeParams:true}),
      mailer = require('../services/mailer'),
      { isInstitucionAdmin, isAdmin, isSedeInstAdmin } = require('../services/middleware'),
      Administrador = require('../db/modelos/administrador'),
      Sede = require('../db/modelos/sede'),
      Institucion = require('../db/modelos/institucion'),
      Alumna = require('../db/modelos/alumna'),
      Grupo = require('../db/modelos/grupo'),
      Instructora = require('../db/modelos/instructora'),
      aH = require('express-async-handler');

router.get('/', isInstitucionAdmin, (req,res) => {
  res.render('sede/index')

})

router.get('/new', aH( async (req,res,next) => {
    const inst = await Institucion.findById(req.params.instId).exec();
    return res.render("sede/new", { institucion:inst });
}))

router.get('/:sedeId', isAdmin,aH( async (req,res) => {

  let sede = await Sede.findById(req.params.sedeId).populate({
    path:'grupos',
    model: 'Grupo',
    populate: {
      path: 'instructora',
      model: 'Instructora'
    }
  }).exec();
  let institucion = await sede.getInstitucion();
  console.log('institucion :', institucion);
  console.log('sede :', sede);
  let inst = sede.grupos.map(grupo =>{
    console.log('grupo.instructora._id :', grupo.instructora._id);
    return grupo.instructora._id;
  }) 
  console.log('inst :', inst);
  let instructoras = await Instructora.find({_id: {$nin: inst}, sedeActual: sede._id}).exec();
  console.log('instructoras :', instructoras);
  let alumnas = await Alumna.find({grupo:null}).exec();
  for(let grupo of sede.grupos){
    grupo.alumnas = await grupo.getAlumnas();
    console.log('grupo :', grupo);
  }

  res.render('sede/show', {sede ,instructoras, institucion, alumnas})
}))

router.get('/:sedeId/edit',  isSedeInstAdmin, aH( async (req,res,next) => {
  let sede = await Sede.findById(req.params.sedeId).exec();
  let institucion = await Institucion.findById(req.params.instId).exec();
  res.render('sede/edit', {sede, institucion})
}))

router.put('/:sedeId', isSedeInstAdmin, aH( async (req,res,next) => {
  console.log('req.body :', req.body);
  let sede = await Sede.findByIdAndUpdate(req.params.sedeId, req.body, {new:true});
  req.flash("success", "Se actualizó la sede correctamente");
  return res.redirect('/instituciones/'+req.params.instId +'/sedes/'+sede._id);
}))

router.get('/new/invite',isInstitucionAdmin, aH( async (req,res) => {
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
    adminType: "Sede",
    sede: sede._id
  })
  await admin.save();

  inst.register(sede);
  req.flash('success', 'Se postulo correctamente la sede! Espere la revision del administrador')
  res.redirect('/')
}))





module.exports = router;
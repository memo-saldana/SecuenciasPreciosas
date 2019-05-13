const express = require('express'),
      router = express.Router({mergeParams:true}),
      mailer = require('../services/mailer'),
      { isInstitucionAdmin, isAdmin, isSedeInstAdmin, isInstructora } = require('../services/middleware'),
      Administrador = require('../db/modelos/administrador'),
      Sede = require('../db/modelos/sede'),
      Institucion = require('../db/modelos/institucion'),
      Grupo = require('../db/modelos/grupo'),
      Curso = require('../db/modelos/curso'),
      Instructora = require('../db/modelos/instructora'),
      aH = require('express-async-handler');

      
      
      router.get('/new', isSedeInstAdmin, aH( async (req,res,next) => {
  const sede = await Sede.findById(req.params.sedeId).exec();
  console.log('sede :', sede);
  let inst = sede.grupos.map(grupo =>{
    console.log('grupo.instructora :', grupo.instructora);
    return grupo.instructora;
  })
  const instructoras = await Instructora.find({_id: {$nin: inst}, sedeActual: sede._id}).exec();
  console.log('instructoras :', instructoras);
  let {instId} = req.params;
  const cursos = await Curso.find({}).exec();
  res.render('grupo/new', {sede, instructoras, instId, cursos});
}))

router.get('/:grupoId', isInstructora, aH( async (req,res,next) => {
  const grupo = await Grupo.findById(req.params.grupoId).populate('curso').exec();
  grupo.alumnas = await grupo.getAlumnas();
  res.render('grupo/show',{ grupo:grupo, instId:req.params.instId, sedeId:req.params.sedeId });
}))

router.post('/', isSedeInstAdmin, aH( async (req,res,next) => {
  console.log('Postin');
  const sede = await Sede.findById(req.params.sedeId).populate('grupos').exec();
  let count = sede.grupos.length+1; 
  let grupo = new Grupo({
    numeroGrupo: count,
    salon: req.body.salon,
    instructora: req.body.instructora
  })
  
  await grupo.save();
  console.log('grupo :', grupo);
  sede.grupos.push(grupo._id);
  await sede.save();
  req.flash('success','Se creó el grupo exitosamente!')
  res.redirect('/instructoras/'+req.params.instId + '/sedes/'+req.params.sedeId);

}))

module.exports = router;
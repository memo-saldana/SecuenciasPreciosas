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

router.get('/:alumnaId/editGrupo', aH( async (req,res,next) => {
  const sede = await Sede.findById(req.params.sedeId).populate(
  {    
    path:'grupos',
    model: 'Grupo',
    populate: {
      path: 'instructora',
      model: 'Instructora'
    }
  }).exec();

  const alumna = await Alumna.findById(req.params.alumnaId).exec();

  res.render('alumna/editGrupo',{grupos: sede.grupos, alumna: alumna, instId: req.params.instId, sedeId: req.params.sedeId});
}))

router.post('/:alumnaId/editGrupo', aH( async (req,res,next) => {
  console.log("Postin");
  
  const alumna = await Alumna.findByIdAndUpdate(req.params.alumnaId, { grupo: req.body.grupo}, {new: true});
  console.log('alumna :', alumna);
  req.flash('success','Se agregó la alumna exitosamente!');
  res.redirect('/instituciones/'+req.params.instId + '/sedes/'+req.params.sedeId);
}))
module.exports = router;
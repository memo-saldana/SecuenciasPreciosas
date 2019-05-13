const express = require("express"),
      router = express.Router({mergeParams: true}),
      aH = require('express-async-handler'),
      passport = require('passport'),
      Alumna = require('../db/modelos/alumna'),
      Instructora = require('../db/modelos/instructora'),
      Institucion = require('../db/modelos/institucion'),
      Sede = require('../db/modelos/sede'),
      Curso = require('../db/modelos/curso'),
      Grupo = require('../db/modelos/grupo'),
      Aviso = require('../db/modelos/avisos'),
      Administrador = require('../db/modelos/administrador'),
      { isMITAdmin, isLoggedIn , isAdmin, hasRegisterToken } = require('../services/middleware');

router.get('/new', (req,res) => {
  res.render('aviso/new', {instId: req.params.instId, sedeId: req.params.sedeId, grupoId: req.params.grupoId });
})

router.post('/', aH( async (req,res,next) => {
  let aviso = new Aviso({
    texto: req.body.texto,
    grupo: req.params.grupoId
  })
  await aviso.save();
  req.flash('success', 'Se publicó el aviso exitosamente');
  res.redirect('/instituciones/'+req.params.instId + '/sedes/'+req.params.sedeId + '/grupos/'+req.params.grupoId);
}))



module.exports = router;


/**
 * 
 * 


 {                                                              
        "_id" : ObjectId("5cd9acf92f0035629c92e4b2"),          
        "fecha" : ISODate("2019-05-13T17:44:07.665Z"),         
        "imagenes" : [ ],                                      
        "archivos" : [ ],                                      
        "texto" : "Primer aviso del cursoo!",       
        "grupo": ObjectId("5cd898a0e599a420c07eff25"),
        "__v" : 0                                              
}                                                              

 */
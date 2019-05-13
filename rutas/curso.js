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

router.get('/new', isMITAdmin, (req,res) => {
  res.render('curso/new')
})

router.post('/', isMITAdmin, aH( async (req,res,next) => {
  let curso = new Curso({
    nombre: req.body.nombre,
    fechaInicio: new Date(req.body.fechaInicio),
    fechaFin: new Date(req.body.fechaFin)
  })

  await curso.save();
  req.flash("success", "Se creo el curso exitosamente!")
  res.redirect('/adminPanel')
}))



module.exports = router;
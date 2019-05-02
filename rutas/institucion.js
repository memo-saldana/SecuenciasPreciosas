const express = require('express'),
      router = express.Router(),
      Institucion = require('../db/modelos/institucion'),
      aH = require('express-async-handler');


router.get('/', aH (async (req,res) => {
  const insts = await Institucion.find({})
  res.render('institucion/index', {instituciones: insts});
}))

module.exports = router;
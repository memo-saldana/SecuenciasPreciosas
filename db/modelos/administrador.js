const mongoose = require('mongoose'),
      Usuario = require('./usuario'); 

var adminSchema = new mongoose.Schema({
  telefono: {
    type: String
  },
  adminType: {
    type: String,
    enum: ['MIT','Institución','Sede'],
    required: [true, "No se especificó tipo de administrador."]
  },
  institucion: {
    type: mongoose.Types.ObjectId,
    ref: "Institucion"
  },
  sede: {
    type: mongoose.Types.ObjectId,
    ref: "Sede"
  }
})

module.exports = Usuario.discriminator('Administrador',adminSchema);
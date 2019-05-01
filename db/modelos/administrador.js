const mongoose = require('mongoose'),
      Usuario = require('./usuario'); 

var adminSchema = new mongoose.Schema({
  telefono: {
    type: String
  },
  institucion: {
    type: String
  },
  adminType: {
    type: String,
    enum: ['MIT','Institución','Sede']
  }
})

module.exports = Usuario.discriminator('Administrador',adminSchema);
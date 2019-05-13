const mongoose = require('mongoose'),
      Usuario = require('./usuario'); 

var alumnaSchema = new mongoose.Schema({
  nombreTutor: {
    type: String
  },
  telefonoTutor: {
    type: String 
  },
  gradoEscolar: {
    type: Number
  },
  cartaPermiso: {
    type: String
  },
  evidencias: {
    type: [String]
  },
  sede: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sede"
  },
  grupo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grupo"
  }
})

alumnaSchema.methods.addEvidencia = async function(evidencia){
  this.evidencias.push(evidencia)
  await this.save()
}

module.exports = Usuario.discriminator('Alumna', alumnaSchema);
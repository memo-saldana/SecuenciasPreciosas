const mongoose = require('mongoose');

var avisoSchema = new mongoose.Schema({
  texto:{
    type: String
  },
  fecha: {
    type: Date,
    default: new Date()
  },
  imagenes:{
    type: [String]
  },
  archivos: {
    type: [String]
  },
  grupo:{
    type: mongoose.Types.ObjectId,
    ref: "Grupo"
  }
})

module.exports = mongoose.model('Aviso', avisoSchema);
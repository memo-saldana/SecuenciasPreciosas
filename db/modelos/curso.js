const mongoose = require('mongoose');

var cursoSchema = new mongoose.Schema({
  nombre: {
    type: String
  },
  fechaInicio: {
    type: Date
  },
  fechaFin: {
    type: Date
  },
  imagen: {
    type: String
  }
})

cursoSchema.methods.getNombre = function(){
  return this.nombre
}


module.exports = mongoose.model('Curso',cursoSchema);
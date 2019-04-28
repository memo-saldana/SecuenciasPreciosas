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

cursoSchema.methods.getAvisos = function(){
  const avisos = await mongoose.model('Aviso').find({curso:this._id})
  return avisos;
}

module.exports = mongoose.model('Curso',cursoSchema);
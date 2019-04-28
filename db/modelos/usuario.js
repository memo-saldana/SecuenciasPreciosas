const mongoose = require('mongoose');

var usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String
  },
  fechaDeNacimiento: {
    type: Date
  },
  email: {
    type: String
  }
},{
  discriminatorKey: "tipo"
})


usuarioSchema.methods.getNombre = function(){
  return this.nombre; 
}


module.exports = mongoose.model('Usuario', usuarioSchema);
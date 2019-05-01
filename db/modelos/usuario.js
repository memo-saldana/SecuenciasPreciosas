const mongoose = require('mongoose'),
      passportLocalMongoose  = require('passport-local-mongoose');


var usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String
  },
  fechaDeNacimiento: {
    type: Date
  },
  email: {
    type: String,
    required: [true, "No se recibió un correo"]
  },
  password: {
    type: String
  }
},{
  discriminatorKey: "tipo"
})


usuarioSchema.methods.getNombre = function(){
  return this.nombre; 
}
usuarioSchema.plugin(passportLocalMongoose, {usernameField: 'email'})

module.exports = mongoose.model('Usuario', usuarioSchema);
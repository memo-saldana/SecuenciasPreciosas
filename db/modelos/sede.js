const mongoose = require('mongoose');

var sedeSchema = new mongoose.Schema({
  nombre: {
    type: String,
  },
  cupo:{
    type: Number
  },
  direccion: {
    type: String
  },
  telefono: {
    type: String
  },
  aceptada: {
    type: Boolean,
    default: false
  },
  grupos:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grupo"
  }]
})

sedeSchema.methods.getInstitucion = async function() {
  const inst = await mongoose.model("Institucion").find({ sedes: this._id })
}

module.exports = mongoose.model('Sede', sedeSchema);
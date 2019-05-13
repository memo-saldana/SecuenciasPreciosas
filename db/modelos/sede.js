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
  }],
  registrados: {
    type: Number,
    default: 0
  }
})

sedeSchema.methods.getInstitucion = async function() {
  const inst = await mongoose.model("Institucion").findOne({ sedes: this._id }).exec();
  return inst
}

module.exports = mongoose.model('Sede', sedeSchema);
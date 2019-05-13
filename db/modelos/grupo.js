const mongoose = require('mongoose');

var grupoSchema = new mongoose.Schema({
  numeroGrupo:{
    type: Number
  },
  salon: {
    type: String
  },
  instructora: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructora"
  },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso"
  }
})

grupoSchema.methods.getAlumnas = async function(){
  const alumnas = await mongoose.model('Alumna').find({grupo: this._id}).exec();

  return alumnas;
}
grupoSchema.methods.getAvisos = async function(){
  const avisos = await mongoose.model('Aviso').find({grupo:this._id})
  return avisos;
}

module.exports = mongoose.model('Grupo',grupoSchema);
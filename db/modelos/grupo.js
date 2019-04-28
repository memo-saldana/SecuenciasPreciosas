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
  }
})

grupoSchema.methods.getAlumnas = async function(){
  const alumnas = await mongoose.model('Alumna').find({grupo: this._id}).exec();

  return alumnas;
}

module.exports = mongoose.model('Grupo',grupoSchema);
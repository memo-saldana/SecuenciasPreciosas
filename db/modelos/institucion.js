const mongoose = require('mongoose');

var instSchema = new mongoose.Schema({
  nombre: {
    type: String
  },
  sedes: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Sede"
  }]
})

instSchema.methods.register = async function(Sede) {
  this.sedes.push(Sede)
  await this.save()
}

module.exports = mongoose.model('Institucion',instSchema);
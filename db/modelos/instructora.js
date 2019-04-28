const mongoose = require('mongoose'),
      Usuario = require('usuario'); 

var instructoraSchema = new mongoose.Schema({
  telefono: {
    type: String
  },
  sedePreferencia:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sede"
  }],
  sedeActual: {
    type: String
  },
  aceptada: {
    type: Boolean,
    default: false
  }
})

instructoraSchema.methods.getSede = async function(){
  return await mongoose.model('Sede').findById(this.sedeActual).exec();
}

/**
 * Sets sede
 * @param {String} sedeId el id de la sede; 
 */
instructoraSchema.methods.setSede = async function(sedeId){
  this.sedeActual = await mongoose.model('Sede').findById(sedeId).exec();
  await this.save();
}

module.exports = Usuario.discriminator('Instructora',instructoraSchema);
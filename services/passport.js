const Usuario = require('../db/modelos/usuario'),
      LocalStrategy = require('passport-local').Strategy,
      strats = {};

strats.local = new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {

  Usuario.findOne({email: email}, (err, usuario)=>{
    if(err) return done(err, false)
    
    if(!usuario) return done(null, false, {message: "El correo o la contraseña son incorrectos."})
    usuario.comparePassword(password, (err, matches) => {
      if(err) return done(err, false);
      
      if(matches) {
        return done(null, usuario)
      } else return done(null, false, { message: "El correo o la contraseña son incorrectos."})
    })
  })
})

strats.serial = (usuario,done) => {
  done(null, usuario._id)
}

strats.deserial = (id, done) => {
  Usuario.findOne({_id: id }, (err, usuario)=>{
    done(err, usuario)
  })
}

module.exports = strats;
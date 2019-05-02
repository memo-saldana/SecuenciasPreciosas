const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

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

usuarioSchema.pre('save', function (next) {
  const usuario = this;
  console.log('this :', this);
  console.log('this.isNew :', this.isNew);
  if (this.isModified('password') || (this.isNew && usuario.password)) {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error);
      bcrypt.hash(usuario.password, salt, (error, hash) => {
        if (error) return next(error);
        usuario.password = hash;
        next();
      });
    });
  } else return next();
});

// Using promises to take advantage of async wrapper
usuarioSchema.methods.comparePassword = function (password, cb) {
  // console.log('password :', password);
  // console.log('this.password :', this.password);
  bcrypt.compare(password, this.password, (err, matches) => {
    if(err) cb (err, null);

    cb(null, matches)
  });
};

// usuarioSchema.plugin(passportLocalMongoose, {usernameField: 'email'})

module.exports = mongoose.model('Usuario', usuarioSchema);
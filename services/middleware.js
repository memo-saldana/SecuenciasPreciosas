const Usuario = require('../db/modelos/usuario'),
      Administrador = require('../db/modelos/administrador');

var mw = {};

mw.isLoggedIn = (req,res,next) => {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Debes iniciar sesión para hacer eso.");
	return res.redirect("/login")
}

mw.isMITAdmin = (req,res,next) => {
  if(req.isAuthenticated()){
    if( req.user.tipo === "Administrador"){
      if(req.user.adminType ==="MIT"){
        return next();
      }
      req.flash("error", "No estas autorizado para hacer eso, contacta un administrador MIT para más ayuda.")
      return res.redirect("back")
    }
    req.flash("error", "No estas autorizado para hacer eso.")
    return res.redirect("back")
  }
  req.flash("error", "Debes iniciar sesión para hacer eso.");
	return res.redirect("/login")
}

mw.isInstitucionAdmin = (req,res,next) => {
  if(req.isAuthenticated()){
    if( req.user.tipo === "Administrador"){
      if(req.user.adminType ==="Institución" || req.user.adminType === "MIT"){
        return next();
      }
      req.flash("error", "No estas autorizado para hacer eso, contacta un administrador MIT para más ayuda.")
      return res.redirect("back")
    }
    req.flash("error", "No estas autorizado para hacer eso.")
    return res.redirect("back")
  }
  req.flash("error", "Debes iniciar sesión para hacer eso.");
	return res.redirect("/login")
}

mw.isAdmin = (req,res,next) => {
  if(req.isAuthenticated()){
    if( req.user.tipo === "Administrador"){
      return next();
    }
    req.flash("error", "No estas autorizado para hacer eso.")
    return res.redirect("back")
  }
  req.flash("error", "Debes iniciar sesión para hacer eso.");
	return res.redirect("/login")
}

mw.isSedeInstAdmin = (req,res,next) => {
  if(req.isAuthenticated()){
    if( req.user.tipo === "Administrador"){
      if(req.user.adminType ==="Institución" || req.user.adminType === "Sede"){
        return next();
      }
    }
    req.flash("error", "No estas autorizado para hacer eso.")
    return res.redirect("back")
  }
  req.flash("error", "Debes iniciar sesión para hacer eso.");
	return res.redirect("/login")
}
mw.errorHandler = () => (err,req,res,next) => {
  console.log("err :", err)

  req.flash("error", err.message);

  res.redirect('back')
}

mw.hasRegisterToken = (req,res,next) => {
  if(req.query.token){
    return next();
  } else {
    req.flash("error", "No estas autorizado para hacer esoo" )
    res.redirect('/register');
  } 
}

mw.isInstructora = (req,res,next) =>{
  if(req.isAuthenticated()){
    if(req.user.tipo === "Instructora"){
      return next();
    }
    req.flash("error", "No estas autorizado para hacer eso.")
    return res.redirect("back")
  }
  req.flash("error", "Debes iniciar sesión para hacer eso.");
	return res.redirect("/login")
}

module.exports = mw;
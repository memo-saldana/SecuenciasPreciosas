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
      if(req.user.adminType ==="Institucion" || req.user.adminType === "MIT"){
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

module.exports = mw;
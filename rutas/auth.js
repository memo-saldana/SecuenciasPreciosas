const express = require("express"),
      router = express.Router({mergeParams: true}),
      aH = require('express-async-handler'),
      passport = require('passport'),
      Alumna = require('../db/modelos/alumna'),
      Instructora = require('../db/modelos/instructora'),
      Institucion = require('../db/modelos/institucion'),
      Sede = require('../db/modelos/sede'),
      Grupo = require('../db/modelos/grupo'),
      ObjectId = require('mongoose').Types.ObjectId,
      Administrador = require('../db/modelos/administrador'),
      { isMITAdmin, isLoggedIn , isAdmin, hasRegisterToken } = require('../services/middleware');

router.get('/register',(req,res) => {
  res.render('register');
})

router.get("/register/alumna",aH( async (req,res) => {
  
  const sedes = await Sede.aggregate([
    {
      $match: {
        aceptada: true,
        $expr: { $gt: ['$cupo', '$registrados'] }
      }
    }
  ]).exec()
  console.log('sedes :', sedes);
  res.render("alumna/register", {sedes})
}))
router.post("/register/alumna", aH(async (req,res) => {
   
  let alumna =  new Alumna({
    email: req.body.email,
    password: req.body.password,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    nombre: req.body.nombre,
    nombreTutor: req.body.nombreTutor,
    telefonoTutor: req.body.telefonoTutor,
    gradoEscolar: req.body.gradoEscolar,
    cartaPermiso: req.body.cartaPermiso,
    sede: req.body.sede
  })
  await alumna.save();

  await Sede.findByIdAndUpdate(req.body.sede, { $inc: { registrados: 1 }}).exec();
  req.flash('success', 'Se registró la alumna exitosamente. Espere la aprobación del administrador')
  return res.redirect("/")
}))

router.get("/register/instructora", aH( async(req,res) => {
  const sedes = await Sede.find({ aceptada:true })
  res.render("instructora/register", {sedes})
}))
router.post("/register/instructora", aH(async (req,res) => {
   
  let instructor = new Instructora({
    email: req.body.email,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    password: req.body.password,
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    sedePreferencia: req.body.sedePreferencia,

  }) 
  await instructor.save()
  return res.redirect("/")
}))

router.get("/register/administrador", aH(async (req,res) => {
  return res.render("administrador/register")
}))

router.post("/register/administrador", aH(async (req,res) => {
   
  let admin =  new Administrador({
    email: req.body.email,
    password: req.body.password,
    fechaDeNacimiento: new Date(req.body.fechaDeNacimiento),
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    adminType: req.body.adminType
  })
  await admin.save();
  return res.redirect("/")
}))

router.get('/login',aH(async (req,res) => {
  if(req.isUnauthenticated()){
    res.render('login')
  } else {
    if(req.user.tipo === "Alumna"){
      if(!req.user.grupo){
        req.flash('error', 'No se encontró ningun curso. Inténtalo nuevamente más tarde.');
        req.logout();
        return res.redirect('/login')
      } 
      const gpo = await Grupo.findById(req.user.grupo).exec();
      return res.redirect("/cursos/"+ gpo.curso);
    } else if(req.user.tipo === "Instructora"){

      const sede = await Sede.findById(req.user.sedeActual).populate('grupos').exec();
      const institucion = await sede.getInstitucion();
      let inst = sede.grupos.map(gpo => gpo.instructora);
      let ind = inst.indexOf( i => i == req.user._id )
      if(ind == -1 ){
        req.flash('error', 'No se encontró ningun grupo. Inténtalo nuevamente más tarde.');
        req.logout();
        return res.redirect('/login')
      }
      return res.redirect("/instituciones/" + institucion._id + "/sedes/"+sede._id+"/grupos/"+sede.grupos[ind]._id);
    } else if(req.user.tipo ==="Administrador"){
      if(req.user.adminType == "MIT"){
        console.log("MIT logging in");
       return res.redirect("/adminPanel")
      }
      else if(req.user.adminType == "Institución"){
        console.log("Inst logging in");
        return res.redirect("/instituciones/"+req.user.institucion);
      } 
      else {
        console.log("Sede logging in");
        let sede = await Sede.findOne({_id: req.user.sede}).exec();
        console.log('sede :', sede);
        let inst = await sede.getInstitucion();
        console.log('inst in loggin :', inst);
        res.redirect('/instituciones/'+inst._id+"/sedes/"+sede._id);
      }
    }
  }
}))

router.post('/login',passport.authenticate("local",
  {
    failureRedirect: "/login",
    failureFlash: true
  }), aH(async(req,res) => {
  // console.log("Success");
  
  if(req.user.tipo === "Alumna"){
    if(!req.user.grupo){
      req.flash('error', 'No se encontró ningun curso. Inténtalo nuevamente más tarde.');
      req.logout();
      return res.redirect('/login')
    } 
    const gpo = await Grupo.findById(req.user.grupo).exec();
    return res.redirect("/grupos/"+ gpo._id);
  } else if(req.user.tipo === "Instructora"){
    if(!req.user.aceptada){
      req.flash('error', 'No has sido aceptada aún, intentalo de nuevo más tarde.');
      req.logout();
      return res.redirect('/login')
    }
    const sede = await Sede.findById(req.user.sedeActual).populate('grupos').exec();
    const institucion = await sede.getInstitucion();
    // console.log('sede :', sede);
    // console.log('typeof(req.user._id) :', typeof(req.user._id));
    let ind = sede.grupos.find(gpo => {
      // console.log('gpo.instructora instanceof ObjectId :', gpo.instructora instanceof ObjectId);
      // console.log('req.user._id instanceof ObjectId :', req.user._id instanceof ObjectId);
      return gpo.instructora.equals(req.user._id)
    })
    // console.log('ind :', ind);
    if(!ind){
      req.flash('error', 'No se encontró ningun grupo. Inténtalo nuevamente más tarde.');
      req.logout();
      return res.redirect('/login')
    }
    return res.redirect("/instituciones/" + institucion._id + "/sedes/"+sede._id+"/grupos/"+ind._id);
  } else if(req.user.tipo ==="Administrador"){
    if(req.user.adminType == "MIT"){
      console.log("MIT logging in");
     return res.redirect("/adminPanel")
    }
    else if(req.user.adminType == "Institución"){
      console.log("Inst logging in");
      const inst = await Institucion.findById(req.user.institucion).exec();
      return res.redirect("/instituciones/"+req.user.institucion);
    } 
    else {
      console.log("Sede logging in");
      let sede = await Sede.findOne({_id: req.user.sede}).exec();
      console.log('sede :', sede);

      if(!sede.aceptada){
        req.flash('error', 'La sede aun no ha sido aceptada, intentalo de nuevo más tarde.');
        req.logout();
        return res.redirect('/login')
      } 
      let inst = await sede.getInstitucion();
      console.log('inst in loggin :', inst);
      res.redirect('/instituciones/'+inst._id+"/sedes/"+sede._id);
    }
  }
}))

router.get("/logout", function(req,res) {
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/");
})

router.get('/grupos/:grupoId', isLoggedIn, aH( async (req,res) => {
  const grupo = await Grupo.findOne({_id:req.params.grupoId}).populate('curso instructora').exec();
  grupo.avisos = [];
  grupo.avisos = await grupo.getAvisos();
  console.log('grupo :', grupo);
  res.render('curso/show', {grupo});
}))

router.get('/adminPanel', isMITAdmin, (req,res) => {
  res.render('administrador/panel');
})




module.exports = router;
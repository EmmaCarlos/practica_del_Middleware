const userModel = require("../models/user");
const {validationResult} = require ("express-validator");
const fs= require('fs')
const path= require('path')

module.exports = {
  login: (req,res) => res.render("users/login",{title:"Access"}),
  register: (req,res) => res.render("users/register",{title:"Join"}),
  profile:(req,res) => res.render("users/profile",{title:"Profile"}),
  save: (req,res) => {
    let errors = validationResult(req);//guardamos los datos , y variable para los errores
    if (errors.isEmpty()){//o .length == 0, si no hay errores
      let user= req.body;//si esta vacio entonces crear el usuario
      let avatar = req.file;
      userModel.create(user,avatar);
      return res.redirect("/");//despues de crear vuelva a la pagina inicial 
    }else{//de modo contrario ir a la vista con los errores
      if (req.file != undefined){
        fs.unlinkSync(path.resolve(__dirname,
          "../../public/uploads/avatars/", 
          req.file.filename
          )
        )//eliminar la imagen
      }
      res.render("users/register", {/*mostrar en la vistas los errores*/
        title:"Join",
        errors:errors.mapped(),/* mejor vista con mapped*/  
        data:req.body/*pasar la vieja data*/
      });//pasando a la vista los errores
    }
  },
  access: (req,res) => {
    let errors = validationResult(req); //recibe esos errores
    if (errors.isEmpty()){//verificar la vueltas de errores, si no hay errores entonces registrar
      //buscar el usuario por el email
      let user = userModel.findByEmail(req.body.email);//input checkbox name     
      if (req.body.remember != undefined ){//Si no marcamos el checkbox, culquier dato pero no undefine
          res.cookie("user",//seteamos cookie user 
          user.id,//guardamos esos datos
          {maxAge:1000*60*60*24*30}//tiempo que dure esa cookie, es un año aqui
          );//guardo en una cookie el user, y guardo del user, el id
      }//lo siguiente guardamos los datos en una session
      req.session.user = user;
      return res.redirect("/");//redirigimos a la raiz
    }else{
      if (req.file != undefined){
        fs.unlinkSync(
        path.resolve(__dirname,
        "../../public/uploads/avatars/", 
        req.file.filename
        )
      )
    }
      res.render("users/login", {/*mostrar en la vistas los errores*/
        title:"Access",
        errors:errors.mapped(), /* mejor vista con mapped*/
        data:req.body});/*pasar la vieja data*/
    }//pasando a la vista los errores
  },
  update: (req,res) => {
      userModel.update(req.body,null);
      delete req.session.user;//elimino la sesion previa
      let user = userModel.findByEmail(req.body.email);//
      req.session.user = user;
      return res.redirect("/")
  },
  avatar: (req,res) => {
    
    userModel.update(req.session,req.file);
    delete req.session.user;
    let user = userModel.findByEmail(req.body.email);
    req.session.user = user;
    return res.redirect("/")

  },
  logout: (req,res) => {
    req.session.destroy();
    res.cookie("user",null, {maxAge:0});
    res.redirect("/");
  }
}
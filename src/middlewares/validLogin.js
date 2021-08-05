const {body} = require('express-validator');
const userModel = require('../models/user');
const bcrypt = require ('bcrypt'); 

module.exports = [
    body('email').isEmail().custom((value)=> {
        let existUser = userModel.findByEmail(value);//el finbyemail viene del models/user para buscar
        if (existUser){
            return true
        }else{
            return Promise.reject("No se encontro un usuario");
        }

    }),//en base a el name del ejs

    body('password').isLength({ min:6 }).custom((value,{ req })=>{
        let existUser = userModel.findByEmail(req.body.email);
        let validPassword = existUser? bcrypt.compareSync(value, existUser.password) : false; 
        //comparesync compara texto plano, toma el usuario que existe y el value
        
        if (validPassword){
            return true
        }else {
            return Promise.reject("Password Incorrecto");
        }
    })
]//para que pasen los errores, se quito la funcion por que podria no necesitar 

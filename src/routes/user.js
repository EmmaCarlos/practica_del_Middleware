const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/user");
const isLogged = require("../middlewares/logged");//para verificar si es admin el que se loggeo
const validRegister = require("../middlewares/validRegister");
const validLogin = require("../middlewares/validLogin");
const storage = require("../middlewares/multerMiddleware");//esta con folder para que sea dinamico
const upload = multer({storage: storage("avatars")}) 
//el avatars es sacado de la carpeta uploads/avatars
//uso el multer con la config del modulo storage en multerMiddleware  
//recibe el name:avatar es dinamico se puede poner en products tambien 

router.get("/login",controller.login)
router.get("/register",controller.register)

router.get("/profile",[isLogged],controller.profile)
router.get("/logout",controller.logout)

router.post("/save",[upload.single("avatar"),validRegister],controller.save)
//en el medio puedo mandar varios middlewares por eso se pone como arrays
//avatar es sacado del ejs, single es para que suba de una sola imagen a la vez

router.post("/access",[validLogin],controller.access)//login
//Actualizar perfil 
router.put("/update",controller.update);
router.put("/avatar",[isLogged,upload.single()],controller.access);

module.exports = router
const {body} = require('express-validator');

module.exports = [
    body('email').isEmail().withMessage('Invalid email'),//en base a el name del ejs
    body('password').isLength({min:6}).withMessage('Password is y too short')
]//para que pasen los errores, se quito la funcion por que podria no necesitar 

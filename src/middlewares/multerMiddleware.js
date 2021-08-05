const multer = require('multer')
const path = require('path')

module.exports= function (folder){
    const storage = multer.diskStorage({
        destination:(req,file,cb)=> cb (null, path.resolve(__dirname, '../../public/uploads',folder)), 
        //con folder mi middl es dinamico, armo la ruta y destino el uploads
        filename: (req,file,cb)=> cb (null, file.fieldname + Date.now() + path.extname(file.originalname))
        //es solo el nombre del archivo
    });
    
    return storage;

}
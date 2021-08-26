const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

module.exports = {
  dir: path.resolve(__dirname,"../data","users.json"),
  write: function(data){
    return fs.writeFileSync(this.dir,JSON.stringify(data,null,2))
  },
  all: function (){
    return JSON.parse(fs.readFileSync(this.dir))
  },
  one: function(id){
    return this.all().find(user => user.id == id);
  },
  findByEmail: function (email){
    return this.all().find(user => user.email == email)
  },
  create: function(data,file){  
    let users = this.all();//leyendo todos los usuarios
    let lastUser = users[users.length -1] //leyendo el ultimo usuario si es que existe
    let newUser = {//creo el nuevo usario, como el crud
      id: users.length > 0 ? lastUser.id +1 : 1,//capture la barra de arriba y lastUser y le pongo el id + 1 
      name: data.name ? data.name : String(data.email).trim()//estoy obligando a que el email sea un string, con trim le quito espacios en ini y fin
	.replace(/\s/g, "") //quito espacio en el email
	.split("@")[0]//separo en string por el @ y me quedo con la primera parte
	.toLowerCase(),//paso el texto a miniscula
      email: String(data.email),//tomo el email
      admin: String(data.email).includes("@digitalhouse") || data.email.includes("@dh") ? true: false,//si es con @digitalhose o @dh va hacer admin o no
      password: bcrypt.hashSync(data.password,10),//contrase;a la encripto , cantidad de veces del intentado
      avatar: file ? file.filename: null // si viene un avatar o sino null
    };
    users.push(newUser); //pusheo a mis usuarios que ya estan almacenados
    this.write(users)//los estoy escribiendo
  },
  update:function(data,file,id){
    let users = this.all();
    users.map(user => {
      if(user.id == id){
        user.name = data.name ? data.name : String(data.email).trim()
	.replace(/\s/g, "")
	.split("@")[0]
	.toLowerCase();
        user.email = String(data.email);
        user.admin = String(data.email).includes("@digitalhouse") || user.data.email.includes("@dh") ? true : false;
        user.password = bcrypt.hashSync(data.password,10);
        user.avatar = file ? file.filename : null;
        return user
      }
      return user
    });
    this.write(users)
  },
}
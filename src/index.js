const express = require("express");
const method = require("method-override");
const path = require("path");
const app = express();
const session = require('express-session');
const cookie = require('cookie-parser') 

// App Server
app.set("port",process.env.PORT || 3000)
app.listen(app.get("port"),()=> console.log("server start http://localhost:"+app.get("port")))

// App View
app.set("view engine","ejs");
app.set("views",path.resolve(__dirname,"./views"));

// App Access Public
app.use(express.static(path.resolve(__dirname,"../public")))

// App Middlewares
app.use(express.urlencoded({extended: false})); // add req.body
app.use(express.json());
app.use(method("_method"));
app.use(cookie());
app.use(session({
    secret: "proyecto",
    resave: true,
    saveUninitialized:true}));

//Middlewares Custom
app.use(require ("./middlewares/styles"));//linqueado de los css
app.use(require ("./middlewares/user"));//midd de usuario guardarnos y crearnos el usuario visibleo no a la vista 
// App Routes
app.use(require("./routes/main"))
app.use("/user",require("./routes/user"))
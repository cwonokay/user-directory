
const users    = require('./data.js');
const express = require("express");
const mustacheExpress = require("mustache-express");
const app = express();

app.engine("mustache", mustacheExpress());
app.set("views", "./views")
app.set("view engine", "mustache")
//linked "middleware" to html file
// "/public"add a location for all the files that exsit
app.use(express.static("public"));

// End Point for home directory
app.get("/",function(req,res){
  res.render("index", users);

});

app.get("/listing/:id", function(req,res){
  let user = users.users[req.params.id]
  res.render("listing", users);
});
// Create server and listen on port 3000
app.listen(3000,function(){
  console.log("App is ready on port 3000");
});

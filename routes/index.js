const express = require("express");
const router = express.Router();
const app = express();
let data =[];


const getListing = function(req,res,next){
  let MongoClient = require("mongodb").MongoClient;
  let assert  = require("assert");



  let url='mongodb://localhost:27017/robots';
  MongoClient.connect(url, function(err,db) {
    assert.equal(null,err)


    getData(db,function(){
      db.close();
      next();
    });

  });
  let getData = function(db,callback) {
    let users = db.collection("users");

    users.find({}).toArray().then(function(users){
      data = users;
      callback();
    });
  };

};
router.get("/", getListing, function (req,res) {
  res.render("index", {users:data})

});
router.get('/employed', getListing, function(req, res) {
  // let job = req.params.job;
  let employed = [];
  data.forEach(function(user) {
    if (user.job != null) {
      employed.push(user);

    }
  });
  res.render('employed', {users: employed})
});


router.get('/looking', getListing, function(req, res) {
  // let job = req.params.job;
  let looking = [];
  data.forEach(function(user) {
  if (user.job == null) {
    looking.push(user);

  }
  });
  res.render('looking', {users:looking})
});



router.get('/listing/:id', getListing, function(req, res) {
  let id = req.params.id;
  let userToRender;
  data.forEach(function(user) {
    if (user.id == id) {
      userToRender = user;
    }
  });

  res.render('listing', {users: userToRender});
});







module.exports=router;

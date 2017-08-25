const express = require("express");
const router = express.Router();
const app = express();
const Robots = require("../models/robots");
const mongoose = require("mongoose");
const passport = require('passport');
mongoose.connect("mongodb://localhost:27017/robots");
let data =[];

router.get('/', function(req, res){

    Robots.find({}).sort("name")
    .then(function(robots){
     console.log(robots);
     req.session.users = robots;
     res.render("login", {robots: req.session.users})
    })
    .catch(function(err){
      console.log(err);
    })
  }
);

router.get('/index', function(req, res){
  console.log("we made it");
  res.render("index")
})

router.post('/login', function(req, res){
console.log("we here");
  res.redirect("/index")
});



router.post('/signup', function(req, res){
  Robots.create({
    username: req.body.username,
    passwordHash: req.body.password,
    name: req.body.name,
    email: req.body.email,
    job: req.body.job,
    university: req.body.university,
    company: req.body.company,
    skills: req.body.skills,
    phone: req.body.phone,
    address:{
      street_num: req.body.streetNum,
      Street_name: req.body.streetName,
      city: req.body.city,
      postal_code: req.body.zipCode,
      state: req.body.state,
      country: req.body.country,
    }
  })
  .then(function(data){
    console.log(data);
  })

  res.redirect('/')


});
// router.post("/:robotsId/delete", function(req, res) {
//   Robots.deleteOne({_id: req.params.robotsId}).then(function(robots){
//     res.redirect("/");
//   })
// });
//
// router.get("/:robotsId/edit", function(req, res){
//   Robots.findOne({_id: req.params.robotsId}).then(function(robots){
//     res.render("edit", {robots: robots})
//   })
// });

router.post("/edit/:{{id}}", function(req, res){
  req.user.update({
    username: req.body.username,
    passwordHash: req.body.password,
    name: req.body.name,
    email: req.body.email,
    university: req.body.university,
    job: req.body.job,
    company: req.body.company,
    skills: req.body.skills,
    phone: req.body.phone,
    address:{
      street_num: req.body.streetNum,
      Street_name: req.body.streetName,
      city: req.body.city,
      state: req.body.state,
      postal_code: req.body.zipCode,
      country: req.body.country,
    }


  }).then(function(data){
    console.log("catch");
    console.log(req.user);
  })
  .catch(function(err) {
    console.log(err);
  })

  res.redirect("/")
});

router.get("/edit/:id", function(req, res){

  res.render("profile")
})

///////////////////////////////////////////////////////////

router.get("/",  function (req,res) {
  res.render("index", {users:data})

});
router.get('/employed',  function(req, res) {
  let job = req.params.job;
  let employed = [];
  data.forEach(function(user) {
    if (user.job != null) {
      employed.push(user);

    }
  });
  res.render('employed', {users: employed})
});


router.get('/looking',  function(req, res) {
  let job = req.params.job;
  let looking = [];
  data.forEach(function(user) {
  if (user.job == null) {
    looking.push(user);

  }
  });
  res.render('looking', {users:looking})
});



router.get('/profile/:id',  function(req, res) {
  let id = req.params.id;

  let listing = [];
  data.forEach(function(user) {
    if (user.id == id) {
      listing.push(user);

    }
  });
  console.log(listing);

  res.render('profile', {users: listing});
});


///////////////////////////////////////////////////
const requireLogin = function (req, res, next) {
  if (req.user) {
    console.log(req.user)
    next()
  } else {
    res.redirect('/');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/profile")
  } else {
    next();
  }
};

router.get("/", login, function(req, res) {


  res.render("singup", {
      messages: res.locals.getMessages()
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
  Robots.create({
    username: req.body.username,
    password: req.body.password
  }).then(function(data) {
    console.log(data);
    res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
    res.redirect("/signup");
  });
});

router.get("/profile", requireLogin, function(req, res) {
  res.render("profile", {username: req.user.username});
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});







module.exports=router;

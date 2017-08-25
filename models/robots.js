const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const robotsSchema = new mongoose.Schema({
  username:     {type: String, unique: true, lowercase: true, required: true },
  passwordHash: {type: String, required: true },
  name:         {type: String, required: true },
  email:        {type: String, unique: true, lowercase: true },
  job:          {type: String,  lowercase: true },
  avatar:       {type: String,  lowercase: true },
  university:   {type: String,  lowercase: true },
  company:      {type: String,  lowercase: true },
  skills:       {type: String,  lowercase: true },
  phone:        {type: Number},

  address:      [{
    street_num:          {type: String},
    street_name:         {type: String},
    city:                {type: String},
    postal_code:         {type: Number},
    state:               {type: String},
    country:             {type: String},

  }]

});


robotsSchema.virtual('password')
    .get(function() {
        return null
    })
    .set(function(value) {
        const hash = bcrypt.hashSync(value, 8);
        this.passwordHash = hash;
    })

robotsSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
}

robotsSchema.statics.authenticate = function(username, password, done) {
    this.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            done(err, false)
        } else if (user && user.authenticate(password)) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
};

const Robots = mongoose.model("Robots", robotsSchema);

module.exports = Robots;

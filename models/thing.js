// en fait un schéma tu peux le modifier après

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    lastname: { type: String, required: true },
    firstname: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    isadmin: { type: Boolean, default: false}
});

userSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(user["password"], salt);
    user.password = hash;
    next();
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema) ;

const locationSchema = mongoose.Schema({

    image: { type: String, required: true },
    nom: { type: String, required: true },
    description: { type: String, required: true },
    validated: { type: Boolean, default: false},
    likes: {type: [mongoose.Types.ObjectId]},
    comments : {
        type: [Object],
            userName: String,
            Comment: String,
            date: Date.now
        }
  });

  const Location = mongoose.model('Location', locationSchema) ;

module.exports = {
    User: User,
    Location: Location
};
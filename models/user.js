var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,

    profile: {
        name: { type: String, default: ''},
        picture: { type: String, default: ''}
    },

    address: String,
    history: [{
        date: Date,
        paid: { type: Number, default: 0 }
        // item: { type: Schema.Types.ObjectId, ref: ''}
    }]
});

UserSchema.pre('save', function(next) {
    // this refers to the User instance
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.getSalt(10, function(err, salt) {
        if (err) return next(err);
        // 3rd parameter is 'progress', lets you do something like log
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// always use the .methods method to create a custom method
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);

};


module.exports = mongoose.model('User', UserSchema);

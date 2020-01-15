const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = require('../models/product.model');
const bcrypt = require('bcrypt');

var UserSchema = new Schema ({
    username: {type: String, unique: true, required: true, trim: true},
    email: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    buyList: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: ProductSchema, required: true},
        number: {type: Number, min: 0},
    }],

    name: {type: String, required: true, max:100},
    money: {type: Number, required: true, min: 0},

    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
})

UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

UserSchema.statics.authenticate = function(username, password, callback){
    User.findOne({'username': username})
        .exec(function (err, user) {
            if (err) return callback(err);
            if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password)
                .then(result => {if (result === true) return callback(null, user)
                else return (callback()) })
                .catch((err) => console.log(err));

        })
}
var User = mongoose.model('UserSchema', UserSchema)
module.exports = User;
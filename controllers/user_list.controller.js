const User = require('../models/user.model');

exports.home = async function (req, res) {
    res.send('welcome');
}

/*exports.create = async function (req, res) {
    let user = new User ({
        name: req.body.name,
        money: req.body.money,
    })
    user.save(user).then(
        res.send("New Buyer")
    ).catch(err =>
        next(err)
    )
}*/

exports.signup = async function(req, res) {
    if (req.body.username && req.body.email && req.body.password && req.body.passwordConf){
        var mail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        if (req.body.email.match(mail)) {
            if (req.body.password === req.body.passwordConf) {
                var newUser = new User({
                    name: req.body.name,
                    money: req.body.money,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                })

                await User.create(newUser)
                    .then(() => {
                        req.session.userId = newUser._id;
                    })
                    .catch(err => {
                        console.log(err)
                    });
                res.redirect('/user/profile/');
            } else res.send("Password not match");
        } else {
            res.send('Email not Found');
        }
    }
}

exports.logout = async function (req, res) {
    if (req.session) {
        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect('/home');
        })
    }
}

exports.login = async function(req, res) {
    User.authenticate(req.body.username, req.body.password, function (err, result) {
        if (err || !result) res.send('User not found')
        else {
            req.session.userId = result._id;
            res.redirect('/user/profile');
        }
    })

}

/*exports.delete = function(req, res) {
    User.findByIdAndDelete(req.params.id).then( () => res.send("Successfully Delete")).catch(err => {
        console.log(err);
        next(err);
    })
}*/

exports.list = async function (req, res) {
   User.find({}).sort({'name': -1}).exec((err, element) => console.log(element));
    res.send('testing');
}

exports.update = async function (req, res) {
    User.findByIdAndUpdate(req.session.userId, {$set: req.body}).then(() => res.send("Successfully Update"))
        .catch(err => console.log(err));
}
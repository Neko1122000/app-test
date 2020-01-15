var User = require('../models/user.model')

let Admin = new User({
    username: "Admin",
    email: "Admin@gmail.com",
    password: "verylongpassword",
    name: "Admin",
    money: 0,
    role: "admin",
});

User.create(Admin, (err) => {console.log(err)});
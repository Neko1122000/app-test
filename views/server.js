const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var port = 8080;

const product = require('../routes/product.router');

const mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://maiphuong:ngumuon112@cluster0-j1evl.mongodb.net/test?retryWrites=true&w=majority';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(session({
    secret: "bonjourneko",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection:db
    })
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', product);

//require('../models/seed');

app.listen(port, () => {
    console.log("Testing port: " + port);
});
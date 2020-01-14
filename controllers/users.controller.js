const User = require('../models/user.model');
const Product = require('../models/product.model');

exports.buy = async function (req, res) {
    User.findByIdAndUpdate(req.session.userId).then(user => {
        Product.findById(req.params.product_id, (err, result) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            if (!result) {
                res.send("No product");
                console.log(req.params.product_id);
            } else {
                user.markModified('buyList', 'money');
                const prod = {
                    product: result._id,
                    number: req.body.number,
                };
                user.buyList.push(prod);
                user.save();
                res.send(prod);
            }
        })
    }).catch(err => {res.send("Not found"); next(err)});
}

exports.remove_product = async function (req, res) {
    User.findByIdAndUpdate(req.session.userId).then(user => {
        user.markModified('buyList', 'money');
        var pos = user.buyList.findIndex(element => element.product == req.params.product_id);
        if (pos != -1) user.buyList.splice(pos, 1); else res.send('Product not found');
        //user.buyList.pull(element => element.product == req.params.product_id);
        user.save();
        res.send("ok");
    }).catch(err => {
        console.log(err);
        next(err);
    })
}

exports.update_product = async function (req, res) {
    User.findByIdAndUpdate(req.session.userId).then(user => {
        user.markModified('buyList', 'money');
        var pos = user.buyList.findIndex(element => element.product == req.params.product_id);
        if (pos != -1) user.buyList[pos].number = req.body.number; else res.send('Product not found');
        user.save();
        res.send("ok");
    }).catch(err => {
        console.log(err);
        next(err);
    })
}

exports.product_detail = async function (req, res) {
    User.findById(req.sesssion.userId)
            .populate({path: 'buyList.product'})
                .exec((err, result) =>{
                    if (err) {
                        console.log(err);
                    } else res.send(result.buyList);
    })
}

exports.buy_list = async function (req, res) {
    User.findById(req.sesssion.userId).then(user => {
        Product.find({price: {$lt: user.money}}).sort({price: 1}).then(list => {
            res.send(list);
            console.log('ok');
        }).catch(err => console.log(err));
    })
}

exports.profile = async function(req, res) {
    //console.log(req.session.userId);
    User.findById(req.session.userId).populate('buyList.product').exec((err, element) => {
        if (err) {
            console.log(err);
            //res.send(err);
            //return next(err);
        } else if (element === null) {
            res.status = 400;
            res.send('Not Authorized');
        } else res.send(element);
    });
}

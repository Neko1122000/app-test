const express = require('express');
const router = express.Router();

const product_controller = require("../controllers/product.controller");
const user_controller = require("../controllers/users.controller");
const user_manager = require("../controllers/user_list.controller")

const User = require('../models/user.model');

function requiredLogin (req, res, next){
    if (req.session && req.session.userId) {
        return next();
    }
    res.status = 404;
    res.send('Logged in required');
}

function adminRequired(req, res, next){
    if (req.session && req.session.userId){
        User.findById(req.session.userId)
            .then(result => {
                if (result.role === "admin") return next();
                else {
                    res.status = 404;
                    res.send("Admin Authorized");
                }
            }).catch(err => {
                res.send('Error');
        })
    } else {
        res.send('Not logged in');
    }
}

router.get('/test', product_controller.test);
router.get('/home',user_manager.home);

router.post('/signup', user_manager.signup);
router.post('/login', user_manager.login);
//router.delete('/:id/delete', user_manager.delete);
router.get('/customers', user_manager.list);
router.get('/logout', user_manager.logout);

router.use('/user', requiredLogin);
router.put('/user/update', user_manager.update);

router.get('/user/profile', user_controller.profile);
router.post('/user/buy/:product_id', user_controller.buy);
router.delete('/user/remove/:product_id', user_controller.remove_product);
router.put('/user/update/:product_id', user_controller.update_product);
router.get('/user/buy/detail', user_controller.product_detail);
router.get('/user/buy',  user_controller.buy_list);


//router.use('/product', adminRequired);
router.get('/product', product_controller.list);
router.post('/product/newProduct', product_controller.product_create);
router.put('/product/:id/update', product_controller.product_update);
router.delete('/product/:id/remove', product_controller.product_delete);
router.get('/product/:id', product_controller.product_detail);

module.exports = router;
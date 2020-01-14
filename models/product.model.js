const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = new Schema ({
    name: {type: String, required: true, max: 100},
    price: {type: Number, required: true, min: 0},
});

ProductSchema.index({price: 1});
module.exports = mongoose.model('ProductSchema', ProductSchema);


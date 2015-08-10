
var mongoose = require('mongoose');
mongoose.connect("mongodb://" + process.env.MONGOLAB_URI);

//
module.exports.Brands = require('./brand.js');
module.exports.Users = require('./users.js');
module.exports.Products = require('./product.js');
module.exports.Categories = require('./category.js')

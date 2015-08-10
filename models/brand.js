var mongoose = require('mongoose');

var Brand = new mongoose.Schema({
  brand_name: String,
  product_ids: Array,
})

var Brands = mongoose.model('Brands', Brand)





module.exports = Brands;

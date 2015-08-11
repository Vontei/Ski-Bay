var mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
  seller: String,
  name: String,
  size: Number,
  description: String,
  image_path: String,
  category_id: Array,
})
var Products = mongoose.model('Products', productSchema);

module.exports = Products

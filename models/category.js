var mongoose = require('mongoose')



var categorySchema = new mongoose.Schema({
  name: String,
  productIds: Array,
})

var Categories = mongoose.model('Categories', categorySchema);

module.exports = Categories

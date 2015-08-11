var mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
  seller: String,
  brand_id: String,
  category_id: String,
  size: Number,
  name: String,
  description: String,
  image_path: String
})
var Products = mongoose.model('Products', productSchema);

var exports = module.exports





exports.createProduct = function(seller, brand_id, cat_id, size, name, description, image_path){
  Products.create({
    seller: seller,
    brand_id: brand_id,
    category_id: cat_id,
    size: size,
    name: name,
    description: description,
    image_path: image_path
  })
}


exports.allProduct = function(){
   return Products.find({})
}

exports.showProduct = function(id){
  return Products.findOne({_id: id})
}



exports.updateProduct = function(id, seller, brand_id, cat_id, size, name, description, image_path){
  Products.update({
    _id: id
  },{
    seller: seller,
    brand_id: brand_id,
    category_id: cat_id,
    size: size,
    name: name,
    description: description,
    image_path: image_path
  })
}

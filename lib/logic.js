var mongoose = require('mongoose');
var store = require('../models/index.js')
var bcrypt = require('bcryptjs')



module.exports = {

  // allTheThings: function () {
  //   return store.Products.find({})
  //     .then(function (products) {
  //       store.Categories.find({})
  //     })
  //     .then(function (categories) {
  //       return product = []
  //       console.log('here')
  //       products.forEach(function (product) {
  //         product.category_id.forEach(function (id) {
  //           categories.forEach(function (cat) {
  //             if(cat._id.toString()===id.toString()){
  //               product.categoryNames.push(cat.name)
  //               console.log(product)
  //             }
  //           })
  //         })
  //       })
  //       })
  //     },


  // also find all Categories
  // combine categories with products
  // "return" (via a promise) with the fully populated products
  findAllProducts: function(){
    // find all the products then
    //    find all the categories by the id in the product.category_id array then
    //      each over then and match them
    return store.Products.find({})
  },

  alltheproduct: function(cb){
    store.Products.find({},cb)
  },

  getUserByName: function(user){
    return store.Users.findOne({user_name: user})
  },

  getUserById: function(id){
    return store.Users.findOne({_id: id})
  },

  addUser: function(username,email,hash){
    return store.Users.create({
      user_name: username,
      email: email,
      password: hash,
      cart: []
    })
  },

  addProduct: function(sellerId,name,size,desc,img,catId){
    return store.Products.create({
      seller: sellerId,
      name: name,
      size: size,
      description: desc,
      image_path: img || 'https://s-media-cache-ak0.pinimg.com/236x/71/0e/74/710e743f58787efea59b684855b3f706.jpg' ,
      category_id: [catId]
    })
  },

  findProductByDesc: function(desc){
    return store.Products.findOne({
      description: desc
    })
  },

  findProductById: function(id){
    return store.Products.findOne({_id: id})
  },

  findAllCategories: function(){
    return store.Categories.find({})
  },

  findCategory: function(Catid){
    return store.Categories.findOne({_id: Catid})
  },


  addProductToCategory: function(catId, prodId){
    return store.Categories.update({_id: catId}, {$push: {productIds: prodId}})
  },

  addOffersToProduct: function(id, bid){
    return store.Products.update({_id: id}, { $push: {offers: bid }})
  },

  removeProduct: function(id){
    return store.Products.remove({_id: id})
  },

  updateProduct: function(id,name, size, description){
    return store.Products.update({_id: id},{name: name, size: size, description: description})
  }


}

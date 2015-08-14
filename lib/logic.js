var mongoose = require('mongoose');
var store = require('../models/index.js')
var bcrypt = require('bcryptjs')



module.exports = {

  findAllProducts: function(){
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
  }



}

var mongoose = require('mongoose');
var store = require('../models/index.js')
var bcrypt = require('bcryptjs')

var getUserByName = function (user) {
  return store.Users.findOne({user_name: user});
}

var findProductById = function(id){
  return store.Products.findOne({_id: id})
}

var getUserById = function(id){
  return store.Users.findOne({_id: id})
}

var findAllProducts = function(){
  return store.Products.find({})
}


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
      category_id: catId
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
  },

  getCategoryInfo: function (array) {
    var categories = array.map(function (id) {
      return store.Categories.findOne({_id: id });
    })
    return Promise.all(categories);
  },

  showStuff: function(){
    return store.Products.find({}).then(function (products) {
      return store.Categories.find({}).then(function (categories) {
        products.forEach(function (product) {
          var name = []
          product.category_id.forEach(function (id) {
            categories.forEach(function (category) {
              if(id.toString()===category._id.toString()){
                name.push(category.name)
              }
            })
          })
          product.categoryNames = name
        })
        return products
      })
    })
  },


  checkPassword: function(pw1, confirm){
    if(pw1 === confirm){
      return false
    } else{
      return true
    }
  },


  getSellerAndProduct: function(reqUser, reqParamsId){
       return getUserByName(reqUser)
      .then(function (user) {
       return findProductById(reqParamsId)
      .then(function(product){
        if(product.seller.toString() === user._id.toString()){update = true;}
        return  getUserById(product.seller)
      .then(function (seller) {
        var result = [seller,product]
        return result
        })
      })
    })
  },

  getProfile: function(sessionUser){
    return getUserByName(sessionUser)
    .then(function(user){
      return findAllProducts()
      .then(function (products) {
        var info= []
        for(i=0; i<products.length;i++){
          if(products[i].seller.toString()===user._id.toString()){
            info.push(products[i])
          }
        }
        return [user,products,info]
    })
    })
  },


  postNewProduct: function(){
  store.Users.findOne({user_name: req.session.user})
  .then(function(user){
    logic.addProduct(user._id, req.body.name, req.body.size, req.body.description,
    req.body.image, req.body.category)
  })
  .then(function(){
      return logic.findProductByDesc(req.body.description)
  })
  .then(function(product){
    logic.findAllCategories()
    .then(function(cats){
      for(i=0;i<cats.length;i++){
        for(j=0;j<product.category_id.length;j++){
          if(cats[i]._id.toString() === product.category_id[j]){
          logic.findCategory(cats[i]._id)
            .then(function (cat) {
              cat.productIds.push(product._id);
              return logic.addProductToCategory(cat._id, product._id)
            })
          }
        }
      }
      res.redirect('/')
    })
  })

  },




}

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

var addProduct = function(sellerId,name,size,desc,img,catId){
  return store.Products.create({
    seller: sellerId,
    name: name,
    size: size,
    description: desc,
    image_path: img || 'https://s-media-cache-ak0.pinimg.com/236x/71/0e/74/710e743f58787efea59b684855b3f706.jpg' ,
    category_id: catId
  })
}

var findProductByDesc = function(desc){
  return store.Products.findOne({
    description: desc
  })
}

var findAllCategories = function(){
  return store.Categories.find({})
}


var findCategory = function(Catid){
  return store.Categories.findOne({_id: Catid})
}

var addProductToCategory = function(catId, prodId){
  return store.Categories.update({_id: catId}, {$push: {productIds: prodId}})
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


  validate: function(reqName, reqEmail, reqPw, reqConfirm){
    var error =[]
    if(reqName.length<2 ){
      error.push('Your Name cannot be empty')
    }
    if(reqEmail.length<2){
      error.push('Your email cannot be empty')
    }
    if(reqPw.length<2){
        error.push('Your passwords cannot be empty')
    }
    if(reqConfirm.length<2 || reqConfirm != reqPw){
      error.push('Your passwords do not match')
    }
    return error
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

  // TODO add product.categories to the product
  getSellerAndProduct: function(reqUser, reqParamsId){
    return findProductById(reqParamsId)
    .then(function(product){
      product.cats = [];
      product.category_id.forEach(function (id){
        return findCategory(id)
        .then(function(cat){
          product.cats.push(cat.name)
        })
        .then(function () {
          return getUserById(product.seller)
        })
        .then(function (seller) {
            product.sellerObj = seller;
            console.log(product)
            console.log(product.cats)
            console.log(product.sellerObj)
        })
      })
      return product
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


  postNewProduct: function(reqUser, reqName, reqSize, reqDesc, reqImg, reqCat){
    return getUserByName(reqUser)
    .then(function(user){
      return addProduct(user._id, reqName, reqSize, reqDesc,
      reqImg, reqCat)
    })
    .then(function(){
        return findProductByDesc(reqDesc)
    })
    .then(function(product){
      return findAllCategories()
      .then(function(cats){
        for(i=0;i<cats.length;i++){
          for(j=0;j<product.category_id.length;j++){
            if(cats[i]._id.toString() === product.category_id[j]){
              return findCategory(cats[i]._id)
              .then(function (cat) {
                cat.productIds.push(product._id);
                return addProductToCategory(cat._id, product._id)
              })
            }
          }
        }
      })
    })
  },





}

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var store = require('../models/index.js')
var bcrypt = require('bcryptjs')
var logic = require('../lib/logic.js')


router.get('/', function(req, res, next) {
  var user = req.session.user;
  logic.showStuff().then(function (products) {
    res.render('index', {products: products.sort().reverse(), name: user})
  })
});


router.post('/login', function(req,res,next){
  logic.getUserByName(req.body.user_name).then(function (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user = user.user_name
      res.redirect('/');
    }
  })
})


///logout
router.get('/logout', function(req,res,next){
  req.session = null;
  res.redirect('/')
})


///Get the sign up page
router.get('/user/new',function(req,res,next){
  var user = req.session.user
  res.render('sign_up' ,{user: user})
})

////Create a user
router.post('/user/new',function(req,res,next){
  var hash = bcrypt.hashSync(password, 8);
  if(req.body.password != req.body.confirm){
    res.render('sign_up', {error: "Passwords do not match"})
  }
  if(password === req.body.confirm) {
    logic.addUser(req.body.user_name, req.body.email, hash)
    res.redirect('/')
  }
})


//Get the new product page
router.get('/product/new',function(req,res,next){
  if(req.session.user){
    logic.getUserByName(req.session.user).then(function(user){
      res.render('new', {user: user, id: user._id})
    })
  }
})


router.get('/seller/:id', function(req,res,next){
    var user = req.session.user;
    logic.getUserById(req.params.id)
    .then(function(user){logic.findAllProducts()
      .then(function (products) {
        var info= []
        for(i=0; i<products.length;i++){
          if(products[i].seller.toString()===user._id.toString()){
            info.push(products[i])
          }
        }
      res.render('seller',{user: user, info: info})
    })
  })
})


//Post the new product
router.post('/product/new', function(req,res,next){
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
})




router.get('/profile', function(req,res,next){
  var user = req.session.user;
  logic.getProfile(user).then(function (array) {
    res.render('profile', {user: array[0], info: array[2]})
  })
})


router.get('/show/:id',function(req,res,next){
  var isSession = req.session.user
  var update = false
  logic.getSellerAndProduct(isSession, req.params.id).then(function (result) {
    res.render('show', {
           offers: result[1].offers.sort().reverse()[0],
           product: result[1],
           update: update,
           seller: result[0],
           mainid: req.params.id,
           session: isSession})
    })
})


///make an offer
router.post('/offer/:id',function(req,res,next){
  var productId = req.params.id;
  var bid = req.body.bid;
  logic.addOffersToProduct(productId, bid).then(function () {
    res.redirect('/')
  })
})


///delete a product
router.get('/delete/:id', function(req,res,next){
  logic.removeProduct(req.params.id).then(function(){
  res.redirect('/')
  })
});


//get the product update page. only if user is the same and req.session.user
router.get('/update/:id', function(req,res,next){
  logic.findProductById(req.params.id).then(function (product) {
  res.render('update', {product: product})
  })
})


router.post('/update/:id', function(req,res,next){
  logic.updateProduct(req.params.id, req.body.name, req.body.size, req.body.description).then(function () {
  res.redirect('/profile')
  })
})



module.exports = router;

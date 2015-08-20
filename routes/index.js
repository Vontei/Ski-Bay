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
    } else {
      res.render('index', {error:'Invalid User Name or Password'})
    }
  })
})


router.get('/logout', function(req,res,next){
  req.session = null;
  res.redirect('/')
})


router.get('/user/new',function(req,res,next){
  var user = req.session.user
  res.render('sign_up' ,{user: user})
})


router.post('/user/new',function(req,res,next){
  var error =[]
  if(req.body.user_name.length<2 ){
    error.push('Your Name cannot be empty')
  }
  if(req.body.email.length<2){
    error.push('Your email cannot be empty')
  }
  if(req.body.password.length<2){
      error.push('Your passwords cannot be empty')
  }
  if(req.body.confirm.length<2 || reqConfirm != reqPw){
    error.push('Your passwords do not match')
  }
  if(error.length>=1){
    res.render('sign_up', {signUpError: error})
  } else {
      var hash = bcrypt.hashSync(req.body.password, 8);
        logic.addUser(req.body.user_name, req.body.email, hash).then(function(){
          res.redirect('/')
        })
    }
})


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
    .then(function(user){
      logic.findAllProducts()
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


router.post('/product/new', function(req,res,next){
  logic.postNewProduct(req.body.user, req.body.name,req.body.size,
    req.body.description,req.body.image, req.body.category)
    .then(function () {
      res.redirect('/')
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
    if(isSession.toString()===result.user_name.toString()){
      update = true
    }
    console.log(result)
    res.render('show', {
           offers: result.offers.sort().reverse(),
           product: result,
           update: update,
           seller: result,
           mainid: req.params.id,
           session: isSession})
    })
})


///make an offer
router.post('/offer/:id',function(req,res,next){
  logic.addOffersToProduct(req.params.id, req.body.bid).then(function () {
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

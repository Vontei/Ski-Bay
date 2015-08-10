var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var store = require('../models/index.js')
var bcrypt = require('bcryptjs')



///Get the home page
router.get('/', function(req, res, next) {
  if(req.session.user){
    var user = req.session.user
  }
  store.Products.allProduct().then(function(products){
    res.render('index', {products: products, name: user});
  })
});

///login
router.post('/login', function(req,res,next){
      var user_name = req.body.user_name;
      var password = req.body.password;
      store.Users.findOne({user_name: user_name}).then(function (user) {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.user = user.user_name
          res.redirect('/');
        }
    })
})

///logout
router.get('/logout', function(req,res,next){
  req.session = null;
  res.render('index')
})



//Post the new product
router.post('/product/new', function(req,res,next){
  store.Products.createProduct(
    req.body.user,
    req.body.brand,
    req.body.category,
    req.body.size,
    req.body.name,
    req.body.description,
    'image/path/default'
  )
  res.redirect('/')
})

///Get the sign up page
router.get('/user/new',function(req,res,next){
  res.render('sign_up')
})


////Create a user
router.post('/user/new',function(req,res,next){
  var password = req.body.password;
  console.log(password)
  var hash = bcrypt.hashSync(password, 8);
  console.log(hash)
  if(password != req.body.confirm){
    res.render('sign_up', {error: "Passwords do not match"})
  }
  if(password === req.body.confirm) {
    store.Users.create({
      user_name: req.body.user_name,
      email: req.body.email,
      password: hash,
      cart: []
    })
    res.redirect('/')
  }
})



//Get the new product page
router.get('/new',function(req,res,next){
  res.render('new')
})


///get the product show page
router.get('/show/:id',function(req,res,next){
  store.Products.showProduct(req.params.id).then(function(product){
  res.render('show', {product: product})
  })
})


//get the product update page. only if user is the same and req.session.user

router.get('update/:id', function(req,res,next){
  product.update(req.params.id, req.brand_id, req.cat_id, req.sizes, req.name, req.description, req.price);
  res.redirect('/')
})


module.exports = router;

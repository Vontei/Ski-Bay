var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var store = require('../models/index.js')
var bcrypt = require('bcryptjs')



///Get the home page
router.get('/', function(req, res, next) {
  store.Products.find({}).then(function(products){
    var user = req.session.user;
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




///Get the sign up page
router.get('/user/new',function(req,res,next){
  res.render('sign_up')
})


////Create a user
router.post('/user/new',function(req,res,next){
  var password = req.body.password;
  var hash = bcrypt.hashSync(password, 8);
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
router.get('/product/new',function(req,res,next){
  if(req.session.user){
    store.Users.findOne({user_name: req.session.user}).then(function(user){
      res.render('new', {user: user, id: user._id})
    })
  }
})




//Post the new product
router.post('/product/new', function(req,res,next){
  store.Users.findOne({user_name: req.session.user})
  .then(function(user){
    store.Products.create({
      seller: user._id,
      name: req.body.name,
      size: req.body.size,
      description: req.body.description,
      image_path: req.body.image || 'https://s-media-cache-ak0.pinimg.com/236x/71/0e/74/710e743f58787efea59b684855b3f706.jpg',
      category_id: [req.body.category]
    })
  })
  .then(function(){
      return store.Products.findOne({description: req.body.description})
  })
  .then(function(product){
    store.Categories.find({})
    .then(function(cats){
      for(i=0;i<cats.length;i++){
        for(j=0;j<product.category_id.length;j++){
          if(cats[i]._id.toString() === product.category_id[j]){
            store.Categories.findOne({_id: cats[i]._id})
            .then(function (cat) {
              cat.productIds.push(product._id);
              return store.Categories.update({_id: cat._id}, { $push: {productIds: product._id }})
            })
          }
        }
      }
  res.redirect('/')
    })
})
})





///Get the profile

router.get('/profile', function(req,res,next){
  var user = req.session.user;
  store.Users.findOne({user_name: user}).then(function(user){
    store.Products.find({}).then(function (products) {
      var results = products.map(function (e) {
        // if(e.seller===)

      })
    })

    res.render('profile',{user: user})
  })

})


///get the product show page
router.get('/show/:id',function(req,res,next){
  var update = false
  var results = Promise.all([
    store.Users.findOne({user_name: req.session.user})
      .then(function (user) {
        store.Products.findOne({_id: req.params.id})
      .then(function(product){
        if(product.seller.toString() === user._id.toString()){update = true;}
        store.Users.findOne({_id: product.seller})
      .then(function (seller) {
        var result = [seller,product]
        console.log(result)
        res.render('show', {product: result[1], update: update, seller: result[0], mainid: req.params.id })
        })
      })
    })
  ])
})



///make an offer

router.post('/offer/:id',function(req,res,next){
  var productId = req.params.id;
  var bid = req.body.bid;
  store.Products.update({_id: req.params.id}, { $push: {offers: bid }}).then(function () {
    res.redirect('/')
  })
})




///delete a product
router.get('/delete/:id', function(req,res,next){
  store.Products.remove({_id: req.params.id}).then(function(){
    console.log('hi')
  res.redirect('/')
  })
});





//get the product update page. only if user is the same and req.session.user

router.get('/update/:id', function(req,res,next){
  // product.update(req.params.id, req.brand_id, req.cat_id, req.sizes, req.name, req.description, req.price);
  res.render('update')
})




//get each brand????
router.get('/atomic',function(req,res,next){
  store.Products.find({}).then(function(products){
    var brands = products.map(function(product){
      return product.brand_id
    })
    store.Category.find({_id: {$in: brands}}).then(function(results){
    var user = req.session.user;
    res.render('index', {products: products, name: user});
    })
})
})


module.exports = router;

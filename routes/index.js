var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var store = require('../models/index.js')


router.get('/', function(req, res, next) {
  store.Products.allProduct().then(function(products){
  res.render('index', {products: products});
  })
});



router.post('/new', function(req,res,next){
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



router.get('/new',function(req,res,next){
  res.render('new')
})


router.get('/show/:id',function(req,res,next){
  store.Products.showProduct(req.params.id).then(function(product){
  res.render('show', {product: product})
  })
})


router.get('update/:id', function(req,res,next){
  product.update(req.params.id, req.brand_id, req.cat_id, req.sizes, req.name, req.description, req.price);
  res.redirect('/')
})


module.exports = router;

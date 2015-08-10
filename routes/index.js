var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var store = require('../models/index.js')


router.get('/', function(req, res, next) {
  store.Products.showProduct().then(function(data){
  res.render('index', {products: data});
  })
});

router.post('/add', function(req,res,next){
  store.Products.createProduct(
    req.body.user,
    req.body.brand,
    req.body.category,
    req.body.size,
    req.body.name,
    req.body.description,
    'image/path'
  )
  res.redirect('/')
})



router.get('update/:id', function(req,res,next){
  product.update(req.params.id, req.brand_id, req.cat_id, req.sizes, req.name, req.description, req.price);
  res.redirect('/')
})


module.exports = router;

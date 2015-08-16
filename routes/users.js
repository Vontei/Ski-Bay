var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;



// var findProductNames = function(category) {
//   var promiseArray = [];
//   category.productIds.forEach(function (id) {
//     promiseArray.push(logic.findProductById(id))
//   })
//   return Promise.all(promiseArray)
// }
//
//
//
// var master = {}
// logic.findAllCategories().then(function (categories) {
//   var promiseArray = []
//   master.categories= categories
//   categories.forEach(function (category) {
//     // console.log(category, 'this is category')
//     promiseArray.push(findProductNames(category))
//   })
//   return Promise.all(promiseArray)
// }).then(function (info) {
//   for (var i = 0; i < master.categories.length; i++) {
//     master.categories[i].products = info[i]
//   }
//   console.log(master.categories[0].products, 'master object')
// })

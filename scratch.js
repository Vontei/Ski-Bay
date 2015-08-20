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



// return getUserByName(reqUser).then(function (user) {
//   return findProductById(reqParamsId).then(function(product){
//     product.category.forEach(function () {
//       var cats = []
//       findCategory(id).then(function(cat){
//         cats.push(cat.name)
//       })
//     })
//     product.categories.push(cats)
//

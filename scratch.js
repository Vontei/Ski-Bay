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

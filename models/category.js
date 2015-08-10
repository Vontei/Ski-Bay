var mongoose = require('mongoose')
var exports = module.exports


var categorySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  ObservIds: Array,
  Comments: Array
})

var Categories = mongoose.model('Category', categorySchema);



exports.addCategory = function(name, brand_id){
  var name = Categories.create({

  })

}

var mongoose = require('mongoose')

var usersSchema = new mongoose.Schema({
  user_name: String,
  email: String,
  password: String,
  itemsForSale: Array,
  cart: Array
})
var Users = mongoose.model('Users', usersSchema);

module.exports = Users

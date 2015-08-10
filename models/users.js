var mongoose = require('mongoose')

var usersSchema = new mongoose.Schema({
  user_name: String,
  email: String,
  password: String,
  cart: Array
})
var Users = mongoose.model('Users', usersSchema);

module.exports = Users

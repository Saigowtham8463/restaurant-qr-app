const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,

  category: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model(
  "Menu",
  menuSchema
)
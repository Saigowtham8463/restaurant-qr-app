const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  },

  // ⭐ NEW: Table Number (IMPORTANT for restaurant system)
  tableNumber: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Order", orderSchema)
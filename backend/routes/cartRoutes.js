const express = require("express")
const router = express.Router()

const Cart = require("../models/Cart")

// ADD item to cart
router.post("/cart", async (req, res) => {
  try {
    const item = new Cart(req.body)
    await item.save()
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET all cart items
router.get("/cart", async (req, res) => {
  try {
    const items = await Cart.find()
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE item from cart
router.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.json({ message: "Item removed from cart" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
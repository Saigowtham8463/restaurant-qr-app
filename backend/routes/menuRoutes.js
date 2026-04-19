const express = require("express")
const router = express.Router()

const Menu = require("../models/Menu")

// GET all menu items
router.get("/menu", async (req, res) => {
  try {
    const items = await Menu.find()
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ADD new menu item
router.post("/menu", async (req, res) => {
  try {
    const item = new Menu(req.body)
    await item.save()
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE menu item
router.delete("/menu/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id)
    res.json({ message: "Menu item deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// UPDATE menu item
router.put("/menu/:id", async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updatedItem)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
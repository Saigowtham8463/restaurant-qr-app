const express = require("express")
const router = express.Router()

const Order = require("../models/Order")

// ===============================
// Create new order (UPDATED with tableNumber)
// ===============================
router.post("/order", async (req, res) => {
  try {
    const newOrder = new Order({
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      tableNumber: req.body.tableNumber   // ✅ ADDED
    })

    await newOrder.save()

    res.json({
      message: "Order placed successfully",
      order: newOrder
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


// ===============================
// Get all orders (WITH FILTER)
// ===============================
router.get("/orders", async (req, res) => {
  try {
    const { status } = req.query

    let filter = {}

    if (status) {
      filter.status = status
    }

    const orders = await Order.find(filter)

    res.json(orders)

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


// ===============================
// Update order status
// ===============================
router.put("/order/:id", async (req, res) => {
  try {
    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      )

    res.json(updatedOrder)

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


// ===============================
// Delete order
// ===============================
router.delete("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)

    res.json({
      message: "Order deleted successfully"
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


// ===============================
// Dashboard Stats API
// ===============================
router.get("/orders/stats", async (req, res) => {
  try {
    const orders = await Order.find()

    const totalOrders = orders.length

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    )

    const pendingOrders = orders.filter(
      (o) => o.status === "Pending"
    ).length

    const completedOrders = orders.filter(
      (o) => o.status === "Completed"
    ).length

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


module.exports = router
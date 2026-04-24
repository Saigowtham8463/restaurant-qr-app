const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const QRCode = require("qrcode")

// Import models
const Order = require("./models/Order")

// Import routes
const menuRoutes = require("./routes/menuRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const qrRoutes = require("./routes/qrRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()

/* -------------------------
   MIDDLEWARE
------------------------- */

app.use(cors())
app.use(express.json())

/* -------------------------
   MONGODB CONNECTION
------------------------- */

mongoose.connect(
  "mongodb://127.0.0.1:27017/restaurantDB"
)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err))

/* -------------------------
   ROUTES
------------------------- */

app.use(menuRoutes)
app.use(cartRoutes)
app.use(orderRoutes)
app.use(qrRoutes)
app.use("/auth", authRoutes)

/* -------------------------
   TEST ROUTE
------------------------- */

app.get("/", (req, res) => {
  res.send("Server Running")
})

/* -------------------------
   GET ALL ORDERS
------------------------- */

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })

    res.json(orders)

  } catch (err) {
    console.log("GET ORDERS ERROR:", err)

    res.status(500).json({
      message: "Failed to fetch orders"
    })
  }
})

/* -------------------------
   CREATE ORDER
------------------------- */

app.post("/orders", async (req, res) => {
  try {
    console.log("Incoming order:", req.body)

    const {
      items,
      totalAmount,
      tableNumber
    } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items in order"
      })
    }

    const newOrder = new Order({
      items,
      totalAmount,
      tableNumber,
      status: "Pending",
      createdAt: new Date()
    })

    await newOrder.save()

    res.json({
      message: "Order placed successfully"
    })

  } catch (error) {
    console.log("ORDER ERROR:", error)

    res.status(500).json({
      message: "Order failed"
    })
  }
})

/* -------------------------
   GENERATE QR FOR ONE TABLE
------------------------- */

app.get("/generate-qr/:tableId", async (req, res) => {
  try {
    const { tableId } = req.params

    const url =
      `http://192.168.1.2:3000/menu?table=${tableId}`

    const qr =
      await QRCode.toDataURL(url)

    res.send(`
      <h2>Table ${tableId}</h2>
      <img src="${qr}" />
      <p>${url}</p>
    `)

  } catch (error) {
    console.log("QR ERROR:", error)

    res.send("Error generating QR")
  }
})

/* -------------------------
   GENERATE QR FOR ALL TABLES
------------------------- */

app.get("/generate-all-qr", async (req, res) => {
  try {
    let html =
      "<h1>Restaurant Table QR Codes</h1>"

    for (let table = 1; table <= 5; table++) {

      const url =
        `http://192.168.1.2:3000/menu?table=${table}`

      const qr =
        await QRCode.toDataURL(url)

      html += `
        <div style="margin:20px">
          <h3>Table ${table}</h3>
          <img src="${qr}" />
          <p>${url}</p>
        </div>
      `
    }

    res.send(html)

  } catch (error) {
    console.log(error)

    res.send("QR generation failed")
  }
})

/* -------------------------
   START SERVER
------------------------- */

const PORT = 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT}`
  )
})
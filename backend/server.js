const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const menuRoutes = require("./routes/menuRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const qrRoutes = require("./routes/qrRoutes")
const authRoutes = require("./routes/authRoutes")


const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err))

// Routes
app.use(menuRoutes)
app.use(cartRoutes)
app.use(orderRoutes)
app.use(qrRoutes)
app.use("/auth", authRoutes)

// Test route
app.get("/", (req, res) => {
  res.send("Server Running")
})

// Start server
const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
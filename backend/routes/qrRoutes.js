const express = require("express")
const router = express.Router()
const QRCode = require("qrcode")

// Generate QR Code for Menu
router.get("/generate-qr", async (req, res) => {
  try {
    const url = "http://192.168.1.6:5000/menu"

    const qrImage = await QRCode.toDataURL(url)

    res.send(`
      <h2>Scan this QR Code to open Menu</h2>
      <img src="${qrImage}" />
    `)
  } catch (error) {
    res.status(500).send("Error generating QR code")
  }
})

module.exports = router
const express = require("express");
const { createBusControler, searchBusControler, searchABusControler} = require("../controllers/busControler");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { 
    updateBusController,
    deleteBusController,
    getBusController,
    getBookingsByBusController,
    resetBusSeatsController} = require("../controllers/adminControler");


const router = express.Router();

// Admin-only routes
router.post("/create", adminMiddleware, createBusControler);
router.get("/bus",adminMiddleware,getBusController)
router.put("/bus/:id", adminMiddleware, updateBusController); // Update an existing bus
router.delete("/bus/:id", adminMiddleware, deleteBusController); // Delete a bus
router.get("/bookings/:busId", adminMiddleware, getBookingsByBusController);
router.post("/reset/:busId", adminMiddleware, resetBusSeatsController);




module.exports = router;

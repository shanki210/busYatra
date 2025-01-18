const busModel = require("../models/busModel");
const bookModel = require("../models/bookedModel")

// Get all buses
const getBusController = async (req, res) => {
  try {
    const busList = await busModel.find(); // Fetch all buses
    res.status(200).json(busList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buses", error: error.message });
  }
};

// Create a new bus
const createBusController = async (req, res) => {
  try {
    const { name, from, to, price } = req.body;

    // Validate input
    if (!name || !from || !to || price === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create and save the bus
    const newBus = new busModel({ name, from, to, price });
    await newBus.save();

    res.status(201).json({ message: "Bus created successfully", bus: newBus });
  } catch (error) {
    res.status(500).json({ message: "Failed to create bus", error: error.message });
  }
};

// Update a bus
const updateBusController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBus = await busModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ message: "Bus updated successfully", bus: updatedBus });
  } catch (error) {
    res.status(500).json({ message: "Failed to update bus", error: error.message });
  }
};

// Delete a bus
const deleteBusController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBus = await busModel.findByIdAndDelete(id);

    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ message: "Bus deleted successfully", bus: deletedBus });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete bus", error: error.message });
  }
};

const getBookingsByBusController = async (req, res) => {
    try {
      const { busId } = req.params;
      const bookings = await bookModel
        .find({ busId })
        .populate("userId", "name email")  // Populate user name and email
        .populate("busId", "name from to price");  // Populate bus details
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
  };

  const resetBusSeatsController = async (req, res) => {
    try {
      const { busId } = req.params;
  
      // Reset the seats for the bus
      const resetSeats = {};
      for (let i = 1; i <= 22; i++) {
        resetSeats[i] = false;
      }
  
      // Update bus seats
      const updatedBus = await busModel.findByIdAndUpdate(
        busId,
        { seats: resetSeats },
        { new: true }
      );
  
      if (!updatedBus) {
        return res.status(404).json({ message: "Bus not found" });
      }
  
      // Delete all bookings for this bus
      await bookModel.deleteMany({ busId });
  
      res.status(200).json({ message: "Seats reset and bookings deleted", bus: updatedBus });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset bus seats", error: error.message });
    }
  };
  

module.exports = {
  getBusController,
  createBusController,
  updateBusController,
  deleteBusController,
  getBookingsByBusController,
  resetBusSeatsController,
};

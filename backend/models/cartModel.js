const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },

    busId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "bus",
    },
    seatNo: {
      type:Number
    },
    createdAt: { type: Date, default: Date.now },  // Add createdAt field

  },
  { timestamps: true }
);

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;

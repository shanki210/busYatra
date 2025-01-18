const busModel=require("../models/busModel");
const cartModel=require("../models/cartModel")
const authenticate=require("../middlewares/authMiddleware")
const schedule = require("node-schedule");


const getAllcart=async(req,res)=>{
try {
    const allTicket=await cartModel.find({userId:req.body.userId}).populate("busId")
    res.status(200).json(allTicket)
} catch (error) {
    res.status(500).json(error.message)
}
}


const addTocart=async(req,res)=>{
try {
    const newtickt=new cartModel(req.body)
    const addCart=await newtickt.save();
    res.status(200).json(addCart)
} catch (error) {
    res.status(500).json(error.message)
}


}


const cancelTocart=async(req,res)=>{
try {
    const deletd=await cartModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Delted your ticket from Cart")
} catch (error) {
    res.status(500).json("Not deleted")
}


}

const scheduleCartCleanup = () => {
    // Run every 10 seconds for testing
    schedule.scheduleJob('*/10 * * * * *', async () => {
      const tenSecondsAgo = new Date(Date.now() - 10 * 1000); // 10 seconds ago
      try {
        const deletedItems = await cartModel.deleteMany({ createdAt: { $lt: tenSecondsAgo } });
        console.log(`Deleted ${deletedItems.deletedCount} expired cart items`);
      } catch (error) {
        console.error("Error cleaning up cart:", error.message);
      }
    });
  };
  
  scheduleCartCleanup();




module.exports={
    getAllcart,addTocart,cancelTocart
}
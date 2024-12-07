const Ride=require('../models/ride.model');
const jwt=require('jsonwebtoken');
const {publishToQueue}=require('../service/rabbit')


module.exports.createRide=async(req,res)=>{
    const { pickup, destination } = req.body;


    const newRide = new Ride({
        user: req.user._id,
        pickup,
        destination
    })



    await newRide.save();
    publishToQueue("new-ride", JSON.stringify(newRide))
    res.send(newRide);
}

module.exports.acceptRide = async (req, res, next) => {
    try {
        const { rideId } = req.params; // Accessing rideId from req.params
        console.log("Request rideId:", rideId);

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        ride.status = 'accepted';
        ride.captain = req.captain._id; // Ensure captainAuth attaches req.captain

        await ride.save();

        // Publish to queue
        await publishToQueue("ride-accepted", JSON.stringify(ride));

        res.status(200).json(ride);
    } catch (error) {
        console.error("Error accepting ride:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


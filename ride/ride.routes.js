const express=require('express');
const router =express.Router();
const rideController=require('./controllers/ride.controller');
const authMiddleware=require('./middleware/auth')


router.post('/create_ride',authMiddleware.userAuth,rideController.createRide);
router.put('/accept-ride/:rideId',authMiddleware.captainAuth, rideController.acceptRide)




module.exports=router;
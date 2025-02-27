const Captain = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { subscribeToQueue } = require('../service/rabbit')

// const pendingRequests = [];


exports.postRegister=async(req,res)=>{
    try{
     const {Name,Email,Password}=req.body;
     const captain=await Captain.findOne({Email});
     if(captain){
        return res.status(400).json({messsage:"Captain Exist Please signin",success:false});
     }
     const salt=await bcrypt.genSalt(10);
     const hass=await bcrypt.hash(req.body.Password,salt);
     const newCaptain=new Captain({
        Name,Email,Password:hass
     })

     newCaptain.save();
     const token= jwt.sign({id:newCaptain._id},process.env.JWT_KEY,{expiresIn:'1h'})
     res.cookie('token',token);
     res.status(200).json({message:"Regstered Sucesfully",success:true,token:token});

    }
    catch(err){
        console.error(err);
        res.status(500).json({messsage:"Internal Server Error",success:false});
    }
}


exports.postLogin=async(req,res)=>{
    try{
        const{Email,Password}=req.body;
        const captain=await Captain.findOne({Email});
        if(!captain){
            return res.status(404).json({messsage:"Email is not present",success:false});
        }
        const confirmPassword=await bcrypt.compare(Password,captain.Password);
        if(!confirmPassword){
          return res.status(400).json({message:'password is incorrect'});      
        }
            const token=jwt.sign({_id:captain._id},process.env.JWT_KEY,{expiresIn:'1h'})
            res.cookie("token",token)
            res.status(200).json({message:'captain is login',success:true,token:token})
    }
    catch(err){
        console.error(err);
        res.status(500).json({messsage:"Internal Server Error",success:false});
    }
}

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        await blacklisttokenModel.create({ token });
        res.clearCookie('token');
        res.send({ message: 'Captain logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.profile = async (req, res) => {
    try {
        res.status(202).json({captain:req.captain});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports.toggleAvailability = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id);
        captain.isAvailable = !captain.isAvailable;
        await captain.save();
        res.send(captain);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
}

let pendingRequests = [];

module.exports.waitForNewRide = async (req, res) => {
    req.setTimeout(30000, () => {
        res.status(204).end(); 
    });
    pendingRequests.push(res);
};

subscribeToQueue("new-ride", (data) => {
    const rideData = JSON.parse(data);

    
    pendingRequests.forEach(res => {
        res.json(rideData);
    });

    pendingRequests.length = 0;
});
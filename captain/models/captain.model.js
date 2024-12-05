const mongoose=require('mongoose');


const userSchema= new mongoose.Schema({

    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
})
const Captain=new mongoose.model('Captain',userSchema);

module.exports=Captain;
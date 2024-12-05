const express=require('express');
const mongoose =require('mongoose');
require('dotenv').config();

const connectdb=async()=>{
    mongoose.connect(process.env.MONGO_URL,)
    .then(result=>{
        console.log("connected to database")
    })
    .catch(err=>{
        console.log(err);
    })
}
module.exports=connectdb;
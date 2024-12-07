const express = require('express');
const app=express();
const cookieParser = require('cookie-parser');
const rideRoutes=require('./ride.routes.js');
const connectdb=require('./util/database.js');
const rabbit=require('./service/rabbit.js');
rabbit.connect();
connectdb();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/',rideRoutes);



module.exports=app;
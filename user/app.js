const express = require('express');
const app=express();
const cookieParser = require('cookie-parser');
const userRoutes=require('./user.routes.js');
const connectdb=require('./util/database.js');
connectdb();
const RabbitMQ=require('./service/rabbit.js');
RabbitMQ.connect();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/',userRoutes);


module.exports=app;
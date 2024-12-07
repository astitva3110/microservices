const express=require('express');
const app=express();
const captainRoute=require('./captain.routes.js')
const cookieParser = require('cookie-parser');
const connectdb=require('./util/database.js');
const RabbitMQ=require('./service/rabbit.js');
// RabbitMQ.connect();
connectdb();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/',captainRoute);

module.exports=app
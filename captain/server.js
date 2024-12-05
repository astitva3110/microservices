const http=require('http');
const app=require('./app.js');

const server=http.createServer(app);



server.listen(3002,()=>{
    console.log("Captain is running on 3002")
})
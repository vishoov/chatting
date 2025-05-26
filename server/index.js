const express = require('express');
const app = express();
//step 1 create a secure http server
const httpServer = require('http').createServer();
//this is called a http handshake 
const cors = require('cors');
const { Server } = require('socket.io');




//1. normal http server -> RTC server web socket
//secure http handshake 


//webRTC message 
//http security headers 

//route ======= client 
//end to end encrypted 

//2.server security -> CORS
//CORS is mandatory for webRTC  

//we will setup a socket server
const io = new Server(
    httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }
    }
)

//whenever we want to send something we use io.emit
//and whenever we want to receive something we use socket.on



//socket server
io.on("connection", (socket)=>{
    console.log("New User Connected");

    socket.on("message", (data)=>{
        console.log("Message Received: ", data.message);
        
        //send the message to the reciever
        socket.to(data.reciever).emit("forward-message", data.message);

    });

    socket.on("join-room", (roomName)=>{
        console.log(`User joined room: ${roomName}`);
        //socket.join is used to join a room
        socket.join(roomName);

        socket.emit("joined-room", roomName);
    })

})




app.get("/", async (req, res) => {
    res.send("Welcome to the Chat Server");
})




//replace app with httpServer
httpServer.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})
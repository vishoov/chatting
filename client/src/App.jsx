import './app.css'

import { io } from 'socket.io-client'
import { useEffect, useState, useMemo } from 'react'


const App = () => {

  const [messages, setMessages] = useState([]);
  const [socketid, setSocketId] = useState(null);
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const joinRoom=(e)=>{
    e.preventDefault();
    const roomName = e.target[0].value;
    socket.emit("join-room", roomName);
    alert(`Joined room: ${roomName}`);
    e.target[0].value = "";

  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    const message = e.target[0].value;
    const reciever = e.target[1].value;
    socket.emit("message", {message, reciever});
    e.target[0].value = "";
   
    console.log("Message Sent: ", message);
  }


  useEffect(()=>{
    socket.on("connect", ()=>{
      console.log("Connected to server")
      setSocketId(socket.id);
    })

    console.log("Socket", socket);

    socket.on("forward-message", (message)=>{
      console.log("Message Received: ", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);


  return (
    <div className="app-container">
      <h1 className="app-title">
        Welcome to the Chat App
      </h1>
      <p className="app-subtitle">
        {socketid ? `Your Socket ID: ${socketid}` : "Connecting..."}
      </p>
      <p className="app-description">
        Start chatting now!
      </p>

      <form className='app-form' onSubmit = {joinRoom}>
      <input type="text" className='app-input' placeholder='Enter the room name' />
      <button type="submit" className='app-button'>Join Room</button>
      </form>

    <form className='app-form' onSubmit={handleSubmit} >
      <input type="text" className='app-input' placeholder='Enter the message' />
      <input type="text" className='app-input' placeholder='Enter the reciever' id='reciever' />
      <button type="submit" className='app-button'>Send!</button>
    </form>



    <div className="app-messages">
      {messages.map((message, index) => (
        <div key={index} className="app-message">
          {message}
        </div>
      ))}
      </div>


    </div>
  )
}

export default App


//whenever we talk about socket.io, we assume each user is in a room where a room is a unique identifier for a group of users.
//we can use the room name as the unique identifier for the group of users.
//whenever user sends a message to room 'acciojob' the message will be sent to all the users in that room.

//user -> userId, roomId 
const express=require('express')
const path= require('path')
const request= require('request')
const http=require('http')
const socketio =require('socket.io')
const {genMsg,genLocMsg}=require('./utils/messages')
const {adduser,getUser,removeUser,getUsersinRoom}=require('./utils/users')
require('./db/mongoose')
const userRouter=require('./routers/userRoutes')

const roomRouter=require('./routers/roomRoutes')
const app= express()
const publicPathDirectory=path.join(__dirname,'../public')
app.use(express.static(publicPathDirectory))
app.use(express.json())
app.use(userRouter)
app.use(roomRouter)
const server= http.createServer(app)
const io= socketio(server)
const port= process.env.PORT||3000
var hostPath=process.env.hostPath

//let count=0
//#region practice
// add a socket event listner for connection event
// this can be triggred when a client connects or when server connects
// the param socket has info on new client socket
// io.on('connection',(socket)=>{
//     console.log('Connected to WebSocket')
//     // emit method from socket send the event to client
//     socket.emit('countUpdate',count)
//     // listen for click event from client
//     socket.on('increment',()=>{
//         count++
//         // sends the update event to the particular client only
//         //socket.emit('countUpdate',count)
//         // sends the update event to all clients active
//         io.emit('countUpdate',count) 
//     })
// })
//#endregion

io.on('connection',(socket)=>{
    
    socket.on('SendMessage',({msg,tkn},Ack)=>{
       // var {msg,tkn}=data
        const user= getUser(socket.id)
       
        var settings={
            'url':hostPath+'/room/message',
            "method": "PATCH",
            "headers": {
                 "Content-Type": "application/json",
                  "Authorization": "Bearer "+tkn
                    },
            "data": JSON.stringify({roomname:user.room,message:msg}),
        }
        var options = {
            'method': 'PATCH',
            'url': 'localhost:3000/room/message',
            'headers': {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmYxNjVkZjhlNjM3ZjM3MTA2ODgxYzYiLCJpYXQiOjE2MDk2NTYxODZ9.5Ptb5qPdfZa_FhwS6VF-rg91PgDvQTR2wpZzt6uFCDg',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({"roomname":"RAW","message":"hi"})
          
          };
        
          request(settings, function (error, response) {
            if (error) 
            console.log(error);
            console.log(response.body);

          });
        // $.ajax(settings).done((data)=>{
        // console.log(data)
        // })
        // .fail((err)=>{
        // console.log(err)
        // })
        io.to(user.room).emit('Message',genMsg({text:msg,usrname:user.userName}))
        Ack()
    })
    // io.to(room).emit() , socket.broadcast.to(room).emit() 
    //methods help to keep the conversations within a room
    socket.on('join',({usrname,room},callback)=>{
        const {error,user}=adduser({id:socket.id,userName:usrname,room})
        if(error)
        {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('Message',genMsg({text:`Welcome to the ${user.room}, ${user.userName}`,usrname:'Notification'}))
        socket.broadcast.to(user.room).emit('Message',genMsg({text:`${user.userName} has joined!`,usrname:'Notification'}))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersinRoom(user.room)
        })
        callback()
    })
    socket.on('sendlocation',(longitude,latitude,Ack)=>{
       // io.emit('Receivelocation',longitude,latitude)
       const user= getUser(socket.id)
       let MapLink="https://www.google.com/maps?q="+latitude+","+longitude
        io.to(user.room).emit('Receivelocation',genLocMsg(MapLink,user.userName))
        Ack('Location Shared!')
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user)
        {
        io.to(user.room).emit('Message',genMsg({text:`${user.userName} has left`,usrname:'Notification'}))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersinRoom(user.room)
        })
        }
    })
})



server.listen(port,()=>{
    console.log(`port is up and running on ${port}`)
})
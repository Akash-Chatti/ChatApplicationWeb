const Room=require('../db/models/room')
const express= require('express')
const router=new express.Router()
const auth= require('../middleware/auth')
//create a room
router.post('/room',auth,async(req,res)=>{
    try{
    let room= new Room(req.body)
    room.name=room.name.toLowerCase()
    let duplic= await Room.findOne({name:room.name})
    if(duplic)
    {
        return res.status(400).send('Room already exists try joining instead.')
    } 
    room.participents.push({participent:req.user._id})
    await room.save()
   return res.status(201).send({usrname:req.user.name})
    }
    catch(e)
    {
       return res.status(500).send(e)
    }
})
// call it when a user sends a message in a room
router.patch('/room/message',auth,async(req,res)=>{
    try 
    {
        let {roomname,message}= req.body
       
        roomname=roomname.toLowerCase()
        let room= await Room.findOne({name:roomname})
        let user= req.user
        if(!room||!user){
            return res.status(404).send('room/user not found')
        }
        let allMsgs=room.messages
        
        allMsgs.push({username:user.name,message,time:new Date()})
        if(allMsgs.length>=21){
            room.messages=allMsgs.slice(1)
        }
         else{
            room.messages=allMsgs
        }
       
        await room.save()
        res.send('Updated message')
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/room/getbyname',async(req,res)=>
{
    
    let roomname= req.body.roomname
    
        roomname=roomname.toLowerCase()
        var ch= await Room.findOne({name:roomname})
        
       
       return res.send({room:ch})
})
//join a room
router.post('/room/join',auth,async(req,res)=>{  
let {roomname,passcode}=req.body
roomname=roomname.toLowerCase()
let room= await Room.findOne({name:roomname})
let user= req.user

if(!room)
{
    return res.status(404).send('Room / User not found')
}
if(passcode!==room.passcode)
{
return res.status(403).send('Invalid Room passcode')
}
let dup= false
 room.participents.forEach((p)=>{
    if(p.participent.equals(user._id))
   { dup= true
}
})
if(dup)
{
    return res.send({usrname:user.name})
}
room.participents.push({participent:user._id})
await room.save()
res.send({usrname:user.name})

})

module.exports=router
const express=require('express')
const router= new express.Router()
const User=require('../db/models/user')
const auth= require('../middleware/auth')


router.post('/user',async(req,res)=>{
    try{
    let usr= new User(req.body)
    let duplic= await User.findOne({name:usr.name})
    if(duplic)
    {
        return res.send('This user is registered')
    }
    // console.log(usr,req)
    usr.name=usr.name.toLowerCase()
    const tkn= await usr.genAuthToken()
  
    await usr.save()
    res.send(usr)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})


router.post('/user/login',async (req,res)=>{
    try{
        const user =await User.findOne({name:req.body.name.toLowerCase(),password:req.body.password})
        const tkn= await user.genAuthToken()
        res.send({user,tkn})
    }catch(e){
        res.status(400).send('user not found')
    }
})

router.post('/user/logout',auth,async(req,res)=>{
    try{
     req.user.tokens=req.user.tokens.filter((tkn)=>{
        return tkn.token !==req.token
     })
     await req.user.save()
     res.send("succesfully logged out")
    }
    catch(ex){
    res.status(500).send(ex)
    }
})

router.delete('/user',auth,async(req,res)=>{
    try{
        if(!req.user)
        {
            return res.status(400).send('User does not exist')
        }
         await req.usr.remove()
       
        res.send(req.user)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})


module.exports=router
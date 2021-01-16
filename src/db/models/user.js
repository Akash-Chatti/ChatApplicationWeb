const mongoose =require('mongoose')
const Room= require('./room')
const jwt= require('jsonwebtoken')
const UserSchema = new mongoose.Schema({

name:{
    type:String,
    required:true,
    trim:true,
    unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Please use a better password with atleast 6 characters')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{timestamps:true})

UserSchema.virtual(('rooms'),{
    ref:'Room',
    foreignField:'participents.participent',
    localField:'_id'
})

UserSchema.methods.genAuthToken=async function(){
    const user=this
    const tkn =jwt.sign({_id:user._id.toString()},process.env.jsonwebtoken)
    user.tokens= user.tokens.concat({token:tkn})
    await user.save()
    return tkn
    }

UserSchema.pre('remove',async function(next){
    const user= this
    let Rooms= await Room.find({participents:user._id})
   if(Rooms){
       Rooms.forEach((r)=>{
           r.participents= r.participents.filter((p)=>{return p._id!=user._id})
       })
   }
    next()
    })

const User =  mongoose.model('User',UserSchema)
module.exports=User

const mongoose=require('mongoose')

const RoomSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
        passcode:{
            type:String,
            required:true 
        },
        messages:[{
            username:{
                type:String,
                trim:true
            },
            message:{
                type:String,
                trim:true
            },
            time:{
                type:Date
            }
        }],
        participents:[{
            participent:{
            type:mongoose.Schema.Types.ObjectId,
            //required:true,
            ref:'User'
        }}]

    },{timestamps:true}
)

const Room= mongoose.model('Room',RoomSchema)
module.exports=Room
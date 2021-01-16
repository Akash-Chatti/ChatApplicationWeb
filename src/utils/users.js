const User=require('../db/models/user')
const users=[]


const adduser=({id,userName,room})=>{
    userName=userName.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!userName||!room)
    {
        return {error:'User name and room name are required!'}
    }
// check for existing user
    const existinguser=users.find((user)=>{
        return user.userName===userName&& user.room===room
    })
// validate user duplicates
    if(existinguser)
    {
        return {error:'User name is in use'}
    }
// Store user
const user={id,userName,room}
users.push(user)
return {user}
}

const removeUser=(id)=>{
    let index=users.findIndex((user)=> user.id===id)
    if(index!=-1)
    {
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    return users.find((u)=>u.id===id)
}

const getUsersinRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((u)=>u.room===room)
}

// adduser({id:14,userName:'Kakarot',room:'Saiyan'})
// adduser({id:24,userName:'Vegeta',room:'Saiyan'})
// adduser({id:22,userName:'Jiren',room:'universe6'})
// let user= getUser(14)
// let usrlist=getUsersinRoom('Saiyan')
// //let res=removeUser(14)
// console.log(user,usrlist)

module.exports={adduser,getUser,removeUser,getUsersinRoom}
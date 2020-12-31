const genMsg=({text,usrname})=>{
return{
    text,
    createdAt:new Date().getTime(),
    usrname
}
}

const genLocMsg=(url,usrname)=>{
    return{
        url,
        createdAt:new Date().getTime(),
        usrname
    }
    }

module.exports={genMsg,genLocMsg}
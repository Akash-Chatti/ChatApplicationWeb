// this file has access to io package since index.html
// loads socket.io scripts before this script

//this call connects client to a Web Socket
const socket=io()

//Elements from DOM
const msgForm=document.querySelector('#message-form')
const sendLoc=document.querySelector('#sendLoc')
const SendMsgBtn=msgForm.querySelector('#SendMsg')
const inputMsg=msgForm.querySelector('#MsgToSend')
const msgsArea=document.querySelector('#messages')
let sidebar=document.querySelector('#sidebar')

//Template
const msgTemplate= document.querySelector('#msg-Template').innerHTML
const locTemplate= document.querySelector('#Loc-Template').innerHTML
const sidebarTemplate= document.querySelector('#sidebar-Template').innerHTML

//Options
const {usrname,room,tkn}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
    //New message element
    const newmessage=msgsArea.lastElementChild
    //Height of the new message
    const newMessageStyles=getComputedStyle(newmessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=newmessage.offsetHeight +newMessageMargin

    //visible height
    const visibleHeight=msgsArea.offsetHeight

    //Height of messages container
    const Containerheight=msgsArea.scrollHeight

    // how far have i scrolled
    const scrollOffset=msgsArea.scrollTop+ visibleHeight

    if(Containerheight-newMessageHeight<=scrollOffset){
        msgsArea.scrollTop=msgsArea.scrollHeight
    }
}
//#region practice

// receives the events from server
//name of the event is to be mentioned same as on server

// socket.on('countUpdate',(count)=>{
//     console.log('Count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     // send event to server 
//     socket.emit('increment')
// })
//#endregion

const logout=document.querySelector('#logout')

logout.addEventListener('click',()=>{
var settings={
'url':'http://localhost:3000/user/logout',
"method":"POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+tkn
          }
}
$.ajax(settings).done(
    (data)=>{
    console.log(data)
    location.href='/'
})
    .fail((err)=>{
        console.log(err.responseText)
        location.href='/'
    })

})

function change(){
    location.href="/room.html?tkn="+tkn;
}
socket.on('Message',(msg)=>{
    console.log(msg)  
    const html= Mustache.render(msgTemplate,{msg:msg.text,createdAt:moment(msg.createdAt).format('h:mm a'),usrname:msg.usrname})
    msgsArea.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

msgForm.addEventListener('submit',(e)=>{
e.preventDefault()
//disable buttons
SendMsgBtn.setAttribute('disabled','disabled')
sendLoc.setAttribute('disabled','disabled')
// let msg=document.querySelector('[name="MsgToSend"]').value
let msg= e.target.elements.MsgToSend.value
if(!msg)
{
 return window.alert('Cannot send blank message')

}
var data={msg,tkn}
socket.emit('SendMessage',data,()=>{
    //enable buttons
    SendMsgBtn.removeAttribute('disabled')
    sendLoc.removeAttribute('disabled')
    inputMsg.value=''
    inputMsg.focus()
    console.log('Delivered')})
})

sendLoc.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return window.alert('Your browser doesn\'t support geolocation')
    }
    sendLoc.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition(({coords})=>{
    //  socket.emit('sendlocation',`Longitude:${coords.longitude}`,`Latitude:${coords.latitude}`)
      socket.emit('sendlocation',`${coords.longitude}`,`${coords.latitude}`,(stat)=>{
          sendLoc.removeAttribute('disabled')
          console.log(stat)
      })
    })
})

socket.on('Receivelocation',(Map)=>{
console.log(Map)
const html= Mustache.render(locTemplate,{url:Map.url,createdAt:moment(Map.createdAt).format('h:mm a'),usrname:Map.usrname})
msgsArea.insertAdjacentHTML('beforeend',html)
autoscroll()
})

$(document).ready(function(){
        socket.emit('join',{usrname,room},(err)=>{
            if(err)
            {
                window.alert(err)
            }
            })
})



socket.on('roomData',({room,users})=>{
    console.log(room,users)
 const html=Mustache.render(sidebarTemplate,{room,users})
 document.querySelector('#sidebar').innerHTML=html
})

let params = new URLSearchParams(location.search);
const tkn= params.get('tkn')

const RoomForm=document.querySelector('#roomform')
const logout=document.querySelector('#logout')
logout.addEventListener('click',(e)=>{
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
}).fail((err)=>{
        console.log(err.responseText)
        location.href='/'
    })

})

RoomForm.addEventListener('submit',(e)=>{
    e.preventDefault()
var newRoom= e.target.elements.create
var name=e.target.elements.room.value
var passcode=e.target.elements.Password.value

if(newRoom.checked)
{
    var reData={
        name,
        passcode
    
    }
    var settings={
        "url":"http://localhost:3000/room",
        "method":"POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+tkn
          },
          "data": JSON.stringify(reData),
      
    }
    $.ajax(settings).done(function (data) {
        console.log(data)
        location.href='chat.html?room='+name+'&usrname='+data.usrname+'&tkn='+tkn
        
      }).fail((err)=>{window.alert(err.responseText)})
}
else
{
    var reData={
       roomname: name,
        passcode
    
    }
    var settings={
        "url":"http://localhost:3000/room/join",
        "method":"POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+tkn
          },
          "data": JSON.stringify(reData),
      
    }

    $.ajax(settings).done(function (data) {
        console.log(data)
       location.href='chat.html?room='+name+'&usrname='+data.usrname+'&tkn='+tkn
        
      }).fail((err)=>{window.alert(err.responseText)})
}


})
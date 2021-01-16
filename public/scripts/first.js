
// function authenticate()
// {
// console.log(SignUp,Login,usrname,Password)

// }

const subBtn=document.querySelector('#signup')
const form=document.querySelector('#signup-form')
form.addEventListener('submit',(e)=>{
e.preventDefault()
subBtn.setAttribute('disabled','disabled')
let SignUp=e.target.elements.SignUp.value
let usr=e.target.elements.name.value
let pas= e.target.elements.cred.value
var reData={
    "name":usr,
    "password":pas
}
console.log(reData)
if(SignUp==='SignUp')
 {
    var settings = {
        "url": "http://localhost:3000/user",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(reData),
      };
      
      $.ajax(settings).done(function (response) {
       
        if(response=="This user is registered")
        {
           window.alert('This username is registered')
        window.location.href = "/";
        }
        else{
            window.alert(response)
            window.location.href="/room.html?tkn="+data.tkn;
        }
        console.log(response);
      }).fail((err)=>{
        //console.log(err.responseJSON.message);

        window.alert('could not sign up -'+err.responseJSON.message)
        window.location.href = "/";
      });

 
 }
 else if(SignUp==='Login'){
    
    var settings={
        "url":'http://localhost:3000/user/login',
        "method":'POST',
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(reData),
    }
    $.ajax(settings).done(function (data) {
        console.log(data)
        if(data.tkn)
        {
                   window.alert('Logged in succesfully')
                   //console.log(data)
                   window.location.href = "/room.html?tkn="+data.tkn;
        }
        else if(data=='user not found')
        {
        window.alert('Login failed')
        window.location.href = "/";
        }
        
      }).fail((err)=>{

        
        if(err.responseText=='user not found')
        {
            window.alert(err.responseText)
        }
        else{
            window.alert('Login failed')
        }
        window.location.href = "/";
      });

      
    
 }


//authenticate()
//window.location.href="/room.html"
subBtn.removeAttribute('disabled')
})
// $(document).ready(
//     authenticate()
// )
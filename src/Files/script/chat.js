const socket = io();

const welcome = document.getElementById("welcome");
const chat = document.getElementById("chat");
const roomList=document.querySelector("#roomList div");
const userList=document.querySelector("#userList div");

const welcomeForm = welcome.querySelector("form");
const chatForm = chat.querySelector("form");

const messages = chat.querySelector('#messages');
const messageList=chat.querySelector('#messageList');

let userName='Anonymous';
let roomName='None';

function scrollToBottom(){
    messages.scrollTop=messages.scrollHeight;
}

function roomEntered(){
    messageList.innerHTML='';
    welcome.hidden=true;
    chat.hidden=false;
    chat.querySelector('h2').innerText=`${roomName}`;
}
function createMessage(from,message){
    const elem=document.createElement('tr');
    elem.classList.add('chat');
    const elem2=document.createElement('td');
    elem2.classList.add('messageName');
    elem2.innerText=from;

    const elem3=document.createElement('td');
    elem3.classList.add('messageValue');
    elem3.innerText=message;
    
    elem.appendChild(elem2);
    elem.appendChild(elem3);
    
    return elem;
}

welcomeForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    
    const inputName = document.getElementById('inputName');
    const inputRoom = document.getElementById('inputRoom');
    userName=inputName.value;
    roomName=inputRoom.value;
    socket.emit('enterRoom',userName,roomName,roomEntered);
    
});

chatForm.addEventListener('submit',(event)=>{
    event.preventDefault();

    const inputMessage=document.getElementById('inputMessage');
    socket.emit('message',userName,inputMessage.value);

    const messageObject=createMessage('나',inputMessage.value);
    messageObject.classList.add('chatFromMe');
    messageList.appendChild(messageObject)

    scrollToBottom();

    inputMessage.value="";
    inputMessage.focus();
});

socket.addEventListener('message',(from,message)=>{
    //console.log("TOp", messages.scrollHeight,messages.scrollTop,messages.offsetHeight);
    let isBottom=messages.offsetHeight+messages.scrollTop+10>=messages.scrollHeight;
    
    const messageObject=createMessage(from,message);
    messageList.appendChild(messageObject);

    //console.log("Under", messages.scrollHeight,messages.scrollTop,messages.offsetHeight);
    if(isBottom){
        scrollToBottom();
    }
})

socket.addEventListener('enter',(name)=>{
    const messageObject=createMessage('SERVER',`${name} 님이 입장했습니다.`);
    messageObject.classList.add('chatFromServer');
    messageList.appendChild(messageObject);
   
});

socket.addEventListener('exit',(name)=>{
    const messageObject=createMessage('SERVER',`${name} 님이 퇴장했습니다.`);
    messageObject.classList.add('chatFromServer');
    messageList.appendChild(messageObject);
    
});

socket.addEventListener('roomUpdate',(rooms)=>{
    while(roomList.lastChild){
        roomList.removeChild(roomList.lastChild);
    }
    rooms.forEach((room)=>{
        const elem = document.createElement('a');
        elem.innerText=room;
        elem.href=`#${room}`;
        elem.onclick=function(event){
            socket.emit('enterRoom',userName, room, roomEntered);
            roomName=room;
        }
        roomList.appendChild(elem);
    });
})

socket.addEventListener('userUpdate',(users)=>{
    while(userList.lastChild){
        userList.removeChild(userList.lastChild);
    }
    users.forEach((user)=>{
        const elem = document.createElement('a');
        elem.innerText=user.nickName;
        elem.id=`user_${user.id}`;
        elem.href=`#${user.id}`;
        if(user.id==socket.id){
            elem.id=`user_me`;
        }
        userList.appendChild(elem);
    });
})
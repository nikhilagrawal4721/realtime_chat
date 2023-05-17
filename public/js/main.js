const chatForm = document.getElementById('chat-form');

const socket = io();

// const username = '<%- username_ejs%>';
// const room = '<%- room_ejs%>';
// const password = '<%- password_ejs%>';


const username = document.getElementById('ejsusername').innerText;
const room = document.getElementById('ejsroom').innerText;
const password = document.getElementById('ejspassword').innerText;


//Join chatroom 
socket.emit('joinRoom', { username, room, password });

document.getElementById('room-name').innerText = room;

socket.on('roomUsers', (data) => {
    const users_list = data.users;
    document.getElementById('users').innerHTML = '';
    users_list.forEach(element => {
        document.getElementById('users').innerHTML += `<li>${element.username}</li>`;
    });
});

//Message from server 
socket.on('message', msg => {
    document.getElementById('chat-content').innerHTML += `<div class="message"><p class="meta">${msg.username} <span>${msg.time}</span></p><p class="text"> ${msg.text} </p></div>`;
    document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get message text 
    const msg = e.target.elements.msg.value;

    //emitting the sent message
    socket.emit('sent-message', { msg, username, room });

    //making the message box blank 
    e.target.elements.msg.value = '';
})

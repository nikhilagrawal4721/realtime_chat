const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser, removeUser, getRoomUsers } = require('./utils/users.js');
const { addRoom, removeRoom, getRooms, isRoomAvail, checkPassword } = require('./utils/rooms.js');

const bodyParser = require('body-parser')
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs');


//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connnnects
io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room, password }) => {

        const user = userJoin(socket.id, username, room);
        
        if( !isRoomAvail(user.room) )
            addRoom(user.room,password);
        
        socket.join(user.room);

        //Welcome current user
        socket.emit('message', formatMessage('RealChat Bot', 'Welcome to RealChat'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage('RealChat Bot', `${username} has joined the chat`));

        //Send users and room info 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    // Send roomlist to index.html
    io.emit('roomList' , getRooms());

    //Broadcast when user sent a message
    socket.on('sent-message', data => {
        io.to(data.room).emit('message', formatMessage(data.username, data.msg));
    });

    //Runs when client disconneted
    socket.on('disconnect', () => {
        const user = getCurrentUser(socket.id);

        if(user)
        {
            io.to(user.room).emit('message', formatMessage('RealChat Bot', `${user.username} has left the chat`));
            removeUser(user.id);
    
            if( getRoomUsers(user.room).length === 0 )
            {
                removeRoom(user.room);

                // Send roomlist to index.html
                io.emit('roomList' , getRooms());
            }
            
            //Send users and room info 
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });
    
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));


app.post('/join' , (req,res)=>{

    username = req.body.username;
    room = req.body.room;
    password = req.body.password;

    if( checkPassword(room, password) )
    {
        res.render(path.join(__dirname , 'public/chat.ejs') , {user_ejs : username , room_ejs : room, password_ejs : password});
    }

    res.render(path.join(__dirname , 'public/index.ejs') , {msg : "Wrong Password"});
})

app.post('/create', (req,res)=>{
    username = req.body.username;
    room = req.body.room;
    password = req.body.password;

    res.render(path.join(__dirname , 'public/chat.ejs') , {user_ejs : username , room_ejs : room, password_ejs : password});
});

app.get('/' , (req,res)=>{
    res.render(path.join(__dirname , 'public/index.ejs') , { msg : ""});
})
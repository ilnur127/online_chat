const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const router = require('./route');
const { addUser, deleteUser, getUser, getRoomUsers } = require('./users');

const app = express();
app.use(cors({ origin: '*' }));
app.use(router);

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})

io.on('connection', (socket) => {
    // console.log("User was connected")
    socket.on('joinRoom', ({ userName, roomName }) => {
        socket.join(roomName)

        const { user, isExist } = addUser({ name: userName, room: { name: roomName }})

        const userMessage = isExist
            ? `${user.name}, here you go again`
            : `Hey ${user.name}`;

        socket.emit('message', { data: { user: { name: 'Admin' }, message: userMessage } })

        socket.broadcast.to(user.room.name).emit('message', {
            data: { user: { name: 'Admin' }, message: `${userName} has join` }
        })

        io.to(user.room.name).emit("room", {
            data: { users: getRoomUsers(user.room.name) },
        });
    })

    socket.on('leaveRoom', ({ userName, roomName }) => {
        socket.leave(roomName)

        deleteUser({ name: userName, room: { name: roomName }})

        io.to(roomName).emit("message", {
            data: { user: { name: "Admin" }, message: `${userName} has leave` },
        });

        io.to(roomName).emit("room", {
            data: { users: getRoomUsers(roomName) },
        });
    })

    socket.on('sendMessage', ({ message, params }) => {
        // console.log(message, params)
        const user = getUser({ name: params.userName, room: { name: params.roomName }})
        // console.log(user)
        if (user) {
            io.to(user.room.name).emit('message', { data: { user, message}})
        }
    });

    io.on('disconnect', () => {
        console.log("User was disconnected")
    })
})

server.listen(5000, () => console.log("Server is running"));
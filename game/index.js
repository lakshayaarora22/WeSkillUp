const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

let RAM = {};

io.on("connection", (socket) => {
    // console.log(`User connected ${socket.id}!`);

    socket.on("join_room", (data) => {
        socket.join(data.roomId);
        socket.broadcast.emit(`receive_message_${data.roomId}`, {user: `${data.user} has joined!`, count: data.count});
        console.log(`${data.user} joined room - ${data.roomId}`);
    });

    socket.on("send_message", (data) => {
        socket.broadcast.emit(`receive_message_${data.roomId}`, data);
        console.log(`${data.roomId} message - ${data.message}`);
    })

    socket.on("disconnectRoom", (data) => {
        socket.broadcast.emit(`receive_message_${data.roomId}`, {user: `${data.user} has left!`});
        socket.leave(data.roomId);
        console.log(`${data.user} left room ${data.roomId}`);
    });

    socket.on("triggerDisconnectRoom", (data) => {
        socket.broadcast.emit(`trigger_disconnect_room_${data.roomId}`, {roomId: data.roomId});
        socket.leave(data.roomId);
        console.log(`${data.user} left room ${data.roomId}`);
    });

    socket.on("sync_room_count", (data) => {
        socket.broadcast.emit(`sync_room_${data.roomId}`, {roomId: data.roomId, count: data.count});
    });

    socket.on("start_game", (data) => {
        socket.broadcast.emit(`trigger_start_${data.roomId}`, data);
        console.log('Game started');
    });

    socket.on("singlePlayer", (data) => {
        socket.join(data.opponent);
        socket.broadcast.emit(`singlePlayer_${data.opponent}`, data);
    });

    socket.on("scanSinglePlayer", (data) => {
        socket.join(data.user);
        socket.broadcast.emit(`singlePlayer_${data.user}`, data);
    });

    socket.on("singlePlayerMessage", (data) => {
        socket.broadcast.emit(`singlePlayerMessage_${data.accepter}`, data);
    });

    socket.on("switchChance", (data) => {
        socket.broadcast.emit(`switchChance_${data.accepter}`, data);
    });

    socket.on("sendChallenge", (data) => {
        socket.broadcast.emit(`sendChallenge_${data.accepter}`, data);
    });

    socket.on('disconnectUser', (data) => {
        socket.leave(data.accepter);
    });
    
    socket.on('endGame', (data) => {
        socket.broadcast.emit(`triggerEndGame_${data.accepter}`, data);
    })
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
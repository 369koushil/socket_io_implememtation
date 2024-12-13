const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    
    socket.emit('welcome', 'Welcome from backend');

    socket.on("message", ({ rId, msg }) => {
        console.log(`Received from ${socket.id} in Room ${rId}: ${msg}`);
        
        socket.to(rId).emit("receive", `Room ${rId}: ${msg}`);
    });

    socket.on("join-room", (rId) => {
        socket.join(rId);
        console.log(`${socket.id} joined Room ${rId}`);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

const SocketIO=require('socket.io');
const log = require('./logger.js');

exports.init=function(httpServer){
    const wsServer = SocketIO(httpServer);

    wsServer.on("connection",(socket)=>{
        log.l("Connected!");
        let roomName;

        socket.on("enterRoom",(name,room,done)=>{
            roomName=room;
            console.log(`${name} has joined ${roomName}`);
            socket.join(roomName);
            socket.to(roomName).emit('message','SERVER',`${name} has joined ${room}`);
            done();
        });

        socket.on("message",(from,message)=>{
            socket.to(roomName).emit('message',from,message);
        });
    });

    

    log.s('started Live Server');
};
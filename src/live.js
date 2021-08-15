const SocketIO=require('socket.io');
const log = require('./logger.js');


exports.init=function(httpServer){
    const wsServer = SocketIO(httpServer);

    function getPublicRooms(){
        const {
            sockets:{
                adapter:{sids,rooms}
            }
        }=wsServer;
        let publicRooms=Array();
        rooms.forEach((_,room)=>{
            if(!sids.has(room)){
                publicRooms.push(room);
            }
        })
        return publicRooms;
    }
    
    function getUserNames(roomName){
        
        const clients=wsServer.of('/').adapter.rooms.get(roomName);
        let userNames=Array();
        if(clients===undefined){
            return userNames;
        }
        clients.forEach((client)=>{
            userNames.push({id:client,nickName:wsServer.sockets.sockets.get(client).nickName});
        });
        return userNames;
    }
    
    wsServer.on("connection",(socket)=>{
        log.l("Connected!");
        socket.emit('roomUpdate',getPublicRooms());
        socket.on("enterRoom",(name,room,done)=>{
            if(socket.roomName!==undefined){
                socket.leave(socket.roomName);
                socket.to(socket.roomName).emit('exit',socket.nickName);
                wsServer.in(socket.roomName).emit('userUpdate',getUserNames(socket.roomName));
            }
            socket.nickName=name;
            socket.roomName=room;

            console.log(`${name} has joined ${socket.roomName}`);
            socket.join(socket.roomName);
            done();
            socket.to(socket.roomName).emit('enter',socket.nickName);
            wsServer.in(socket.roomName).emit('userUpdate',getUserNames(socket.roomName));
            wsServer.sockets.emit('roomUpdate',getPublicRooms());
        });

        socket.on("message",(from,message)=>{
            socket.to(socket.roomName).emit('message',from,message);
        });

        let roomName='';
        socket.on("disconnecting",()=>{
            socket.to(socket.roomName).emit('exit',socket.nickName);
            roomName=socket.roomName;
        });
        socket.on("disconnect",()=>{
            wsServer.sockets.emit('roomUpdate',getPublicRooms());
            socket.to(roomName).emit('userUpdate',getUserNames(roomName));
            log.l('Disconnected!');
        });
    });

    

    log.s('started Live Server');
};
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors')
const app = express();
const httpServer = createServer(app);
const Perfil = require('./class/perfil');
const { TikTokLiveConnection, WebcastEvent } = require('tiktok-live-connector');

let botConnected = false;

let currentPerfil = null;


const io = new Server(httpServer, {
    cors: {
      origin: "https://tiktokbot-blond.vercel.app", // El cliente que permites
      methods: ["GET", "POST"], // Métodos HTTP permitidos
    },
  });
const corsOptions = {
    origin: "https://tiktokbot-blond.vercel.app", // Asegúrate de que este origen coincida con el de tu aplicación cliente
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Métodos HTTP permitidos
}

app.use(cors(corsOptions));


io.on('connection', (socket) => {
    console.log(`se ha conectado un cliente: ${socket.id}`);
    socket.on('setUsername', (username)=>{
        const newPerfil = new Perfil({username});
        newPerfil.setLive();
        newPerfil.conected(socket);
    })

    socket.on('setPreferents', (preferents)=> {
        
    })

    socket.on('PING', ()=> {
      socket.emit('PONG');
    })
})



module.exports = httpServer;

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors')
const app = express();
const httpServer = createServer(app);
const Perfil = require('./class/perfil');
const ListProfile = new Map();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://tiktokbot-blond.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


const io = new Server(httpServer, {
    cors: {
      origin: "https://tiktokbot-blond.vercel.app", // El cliente que permites
      methods: ["GET", "POST"], // Métodos HTTP permitidos
      allowedHeaders: ["Content-Type"],
      credentials: true
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
        try {
          const newPerfil = new Perfil({username});
          newPerfil.setLive();
          newPerfil.conected(socket);

          // --> Hacer de mejor manera
          ListProfile.set(username,newPerfil);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('setPreferents', (preferents,username)=> {
        //aca para setear las preferencias del usuario.
        console.log(preferents);
        if(!ListProfile.has(username)) return
        const perfil = ListProfile.get(username)
        perfil.preferents = {...preferents}
    })

    socket.on('PING', ()=> {
      socket.emit('PONG');
    })
})



module.exports = httpServer;

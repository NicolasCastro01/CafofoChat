const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const io = require('socket.io')(http);

let users = [];

app.use(express.static('public'));

app.get('/', (req,res) => {
  res.sendFile(__dirname  + '/index.html');
});

io.on('connection', (socket) => {

  socket.on('registered', (user) => {
    socket.broadcast.emit('chat message', `${user.name} connected!`);
    socket.user = user;
    users.push(user);
    updateUsers();

    socket.on('is typing', (name) => {
      socket.broadcast.emit('is typing', name);
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('chat message', `${user.name} disconnected!`);
      for (var i = 0; i < users.length; i++) {
        if(users[i]===socket.user){
          users.splice(users.indexOf(users[i]), 1);
        }
      }
      updateUsers();
    });
  });

  socket.on('is typing', (name) => {
    socket.broadcast.emit('is typing', name);
  });

  socket.on('clear is typing', () => io.emit('clear is typing'));

  socket.on('chat message', (userCredentials) => {
    io.emit('chat message', `${userCredentials.name}: ${userCredentials.msg}`)
    io.emit('clear is typing');
  });
  
});

function updateUsers(){
  io.emit('update', users);
}

http.listen(port, () => {
  console.clear();
  console.log(`[SV] >> Server on!\n[SV] >> Connected in port ${port}`);
});

const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const io = require('socket.io')(http);

function objectNewUser(socketId, Name){
  return {socketId: socketId, name: Name}
}

app.use(express.static('public'));

app.get('/', (req,res) => {
  res.sendFile(__dirname  + '/index.html');
});

let users = []

io.on('connection', (socket) => {
  io.emit('loadUsers', users);
  
  socket.on('registered', (user) => {
    users.push(objectNewUser(socket.id, user.name));
    io.emit('chat message', `${user.name} connected!`);
    io.emit('loadUsers', users);

    socket.on('is typing', (name) => {
      io.emit('is typing', name);
    });

    socket.on('disconnect', () => {
      io.emit('chat message', `${user.name} disconnected!`);
      users = users.filter(User => User.name === user.name);
      io.emit('loadUsers', users);
    });
  });

  socket.on('is typing', (name) => {
    io.emit('is typing', name);
  });

  socket.on('clear is typing', () => io.emit('clear is typing'));

  socket.on('chat message', (userCredentials) => {
    io.emit('chat message', `${userCredentials.name}: ${userCredentials.msg}`)
    io.emit('clear is typing');
  });
  
});


http.listen(port, () => console.log(`[SV] >> Server on!\n[SV] >> Connected in port ${port}`));

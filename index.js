const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const io = require('socket.io')(http);

app.get('/', (req,res) => {
  res.sendFile(__dirname  + '/index.html');
});

io.on('connection', (socket) => {

  socket.on('registered', (user) => {
    io.emit('chat message', `${user.name} connected!`);

    socket.on('is typing', (name) => {
      io.emit('is typing', name);
    });

    socket.on('disconnect', () => {
      io.emit('chat message', `${user.name} disconnected!`);
    });
  });

  socket.on('clear is typing', () => io.emit('clear is typing'));

  socket.on('chat message', (userCredentials) => {
    io.emit('chat message', `${userCredentials.name}: ${userCredentials.msg}`)
    io.emit('clear is typing');
  });
  
});


http.listen(port, () => console.log(`[SV] >> Server on!\n[SV] >> Connected in port ${port}`));

const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 3000 || proccess.env.PORT;
const io = require('socket.io')(http);

app.get('/', (req,res) => {
  res.sendFile(__dirname  + '/index.html');
});

io.on('connection', (socket) => {
  
  
  
  socket.on('registered', (user) => {
    io.emit('chat message', `${user.name} connected!`);

    socket.on('disconnect', () => {
      io.emit('chat message', `${user.name} disconnected!`);
    });
  });

  socket.on('chat message', (userCredentials) => {
    io.emit('chat message', `${userCredentials.name}: ${userCredentials.msg}`)
  });
  
});


http.listen(port, () => console.log(`Server on: http://localhost:${port}`));

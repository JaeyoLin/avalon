const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const nicknames = [];

server.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.sendfile(__dirname + '/index.html');
});

app.use('/public', express.static(__dirname + '/src/web'));

io.sockets.on('connection', (socket) => {
  socket.on('new user', (data) => {
    if (nicknames.indexOf(data) != -1) {

    } else {
      socket.emit('chat', 'SERVER', '歡迎光臨 ' + data);

      socket.nickname = data;
      nicknames.push(socket.nickname);
      io.sockets.emit('usernames', nicknames);
      updateNicknames();
    }
  });

  updateNicknames = () => {
    io.sockets.emit('usernames', nicknames);
  }

  socket.on('send message', (data) => {
    io.sockets.emit('new message', { msg: data, nick: socket.nickname });
  });

  socket.on('disconnect', (data) => {
    if (!socket.nickname) return;
    io.sockets.emit('chat', 'SERVER', socket.nickname + ' 離開了聊天室～');
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    updateNicknames();
  });
});
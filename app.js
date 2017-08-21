const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const SocketConnection = require('./src/server/socket.js');

server.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.sendfile(__dirname + '/src/web/index.html');
});

app.use('/public', express.static(__dirname + '/src/web'));

SocketConnection(io);
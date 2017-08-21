const SocketConstants = require('../common');

const players = [];
const rooms = [];

module.exports = (io) => {
  io.sockets.on('connection', (socket) => {
    socket.on('new user', (data) => {
      if (players.indexOf(data) != -1) {
  
      } else {
        io.sockets.emit(SocketConstants.SYSTEM_INFO, 'SERVER', `${data} 進入遊戲大廳`);
        socket.nickname = data;
        players.push(socket.nickname);
        updatePlayers();
      }
    });
    
    /**
     * 更新玩家
     */
    updatePlayers = () => {
      io.sockets.emit(SocketConstants.PLAYERS, players);
    }
  
    socket.on('send message', (data) => {
      io.sockets.emit('new message', { msg: data, nick: socket.nickname });
    });
  
    socket.on('disconnect', (data) => {
      if (!socket.nickname) return;
      io.sockets.emit(SocketConstants.SYSTEM_INFO, 'SERVER', socket.nickname + ' 離開了聊天室～');
      players.splice(players.indexOf(socket.nickname), 1);
      updatePlayers();
    });
  });
};
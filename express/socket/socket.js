const SocketIo = require('socket.io');

class Socket {
  constructor() {
    const io = this.io = SocketIo();
    io.on('connection', socket => {
      console.log('client connected', socket.id);
      socket.on('ping', function(data) {
        data.wrap = new Date().getTime();
        io.emit('echo', data);
      });
    });
  }

  attach(server) {
    this.io.attach(server, {});
    console.log('socket attached');
  }
}

module.exports = Socket;

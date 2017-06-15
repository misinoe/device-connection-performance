const SocketIo = require('socket.io');
const SocketP2p = require('socket.io-p2p-server');

class Socket {
  constructor() {
    const io = this.io = SocketIo();
    io.on('connection', socket => {
      console.log('client connected', socket.id);
    });
    const p2p = this.p2p = io.use(SocketP2p.Server);
  }

  getNanoSecond() {
    let hrtime = process.hrtime();
    return (hrtime[0] * 1000) + (hrtime[1] / 1000000);
  }

  attach(server) {
    this.io.attach(server, {});
    console.log('socket attached');
  }
}

module.exports = Socket;

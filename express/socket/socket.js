const SocketIo = require('socket.io');
class Socket {
  constructor() {
    const io = this.io = SocketIo();
    io.on('connection', socket => {
      console.log('client connected', socket.id);
    });
    const ns = this.ns = io.of('/ns');
    ns.on('connection', socket => {
      socket.on('ppp', data => {
        data.wrap = this.getNanoSecond();
        socket.emit('echo', data);
        console.log('ping => echo');
      });
      socket.emit('hello');
      console.log('ns connected');
    });
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

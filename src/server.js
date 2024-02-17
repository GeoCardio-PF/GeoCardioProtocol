const net = require('net');
const MessageHandler = require('./messageHandler');

class Server {
    constructor(port) {
        this.port = port;
    }

    start() {
        const server = net.createServer((socket) => {
            socket.on('lookup', (err, ip, family, host) => {
                console.log('Conection from: ', ip)
                console.log('info:')
                console.log('family: ',family)
                console.log('host: ',host)
            })
            socket.on('data', (data) => {
                
                MessageHandler.processMessage(data, socket);
            });
            
        });

        server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}

module.exports = Server;

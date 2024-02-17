const net = require('net');
const MessageHandler = require('./messageHandler');
const readline = require('readline');


class Server {
    constructor(port) {
        this.port = port;
        this.clients = [];
    }

    start() {
        const server = net.createServer((socket) => {

            console.log('Cliente conectado');
            const clientInfo = { socket,manufacturerId: null, clientId: null };
            this.clients.push(clientInfo)




            socket.on('lookup', (err, ip, family, host) => {
                console.log('Conection from: ', ip)
                console.log('info:')
                console.log('family: ',family)
                console.log('host: ',host)
            })
            socket.on('data', (data) => {
                const dataString = data.toString();
                const parts = dataString.slice(1, -1).split('*');
                const manufacturer = parts[0]
                const clientId = parts[1];
                // Update ID of the device
                clientInfo.clientId = clientId;
                clientInfo.manufacturerId = manufacturer;

                MessageHandler.processMessage(data, socket);
            });

            socket.on('close', () => {
                console.log('Cliente desconectado');
                // Removes socket and info of the device disconnected
                this.clients = this.clients.filter(client => client.socket !== socket);
            });
        });

        server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });

        this.initConsoleInput();
    }
    initConsoleInput() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.setPrompt('/->: ');
        rl.prompt();

        rl.on('line', (line) => {
            // length of the content in hexa
            const len = Buffer.byteLength(line).toString(16).toUpperCase().padStart(4, '0');

            this.clients.forEach(client => {
                if (client.clientId) {
                    // format of the message sent to the device
                    const message = `[${client.manufacturerId}*${client.clientId}*${len}*${line}]`;
                    client.socket.write(message);
                    console.log(`Message sent to ${client.clientId}: ${message}`);
                }
            });
            rl.prompt(); // Vuelve a mostrar el prompt
        });
    }
}

module.exports = Server;

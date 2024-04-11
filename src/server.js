const net = require('net');
const MessageHandler = require('./messageHandler');
const readline = require('readline');
const { Device } = require('../dbServer')
import { promises as fs } from 'fs'; // Importar fs.promises

class Server {
    constructor(port) {
        this.port = port;
        this.clients = [];
    }

    start() {
        const server = net.createServer((socket) => {

            console.log('Cliente conectado');
            const clientInfo = { socket,manufacturerId: null, Name: null ,timerhrst, timerTemp: null};
            this.clients.push(clientInfo)

            // Inicia un temporizador para cada cliente conectado
            clientInfo.timerhrst = setInterval(() => {
                this.sendMessageToClient(clientInfo, 'hrtstart,1');
            }, 600000); // 600000 ms = 10 minutos

            // Inicia un temporizador para cada cliente conectado
            clientInfo.timerTemp = setInterval(() => {
                this.sendMessageToClient(clientInfo, 'BODYTEMP2');
            }, 300000); // 300000 ms = 5 minutos

            socket.on('lookup', (err, ip, family, host) => {
                console.log('Conection from: ', ip)
                console.log('info:')
                console.log('family: ',family)
                console.log('host: ',host)
            })
            
            socket.on('data', async (data) => {
                const dataString = data.toString();
                const parts = dataString.slice(1, -1).split('*');
                const manufacturer = parts[0];
                const clientId = parts[1];

                // Update ID of the device
                clientInfo.clientId = clientId;
                clientInfo.manufacturerId = manufacturer;

                try {
                    const [device, created] = await Device.findOrCreate({
                        where: { DeviceId: clientId },
                        defaults: {
                            // Default values
                            DeviceId: clientId,
                            Name: manufacturer,
                        }
                    });
            
                    if (created) {
                        console.log('Device registered:', device);
                    }
                } catch (error) {
                    console.error('Error finding or creating the entry:', error);
                }
                const messageLength = Buffer.byteLength(dataString);
                const logMessage = `Mensaje recibido: ${dataString} con longitud de ${messageLength} bytes\n`;

                // Añadir al archivo log.txt de forma asíncrona
                try {
                    await fs.appendFile('log.txt', logMessage);
                } catch (err) {
                    console.error('Error:', err);
                }

                MessageHandler.processMessage(data, socket);
            });

            socket.on('close', () => {
                console.log('Cliente desconectado');
                // Removes socket and info of the device disconnected
                if (clientInfo.timerhrst) {
                    clearInterval(clientInfo.timerhrst);
                }
                if (clientInfo.timerTemp) {
                    clearInterval(clientInfo.timerTemp);
                }
                this.clients = this.clients.filter(client => client.socket !== socket);
            });
        });

        server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });

        //this.initConsoleInput();
    }

    sendMessageToClient(client, message) {
        if (client.clientId) {
            const len = Buffer.byteLength(message).toString(16).toUpperCase().padStart(4, '0');
            const formattedMessage = `[${client.manufacturerId}*${client.clientId}*${len}*${message}]`; 
            client.socket.write(formattedMessage);
            console.log(`Message sent to ${client.clientId}: ${formattedMessage}`);
        }
    }

}

module.exports = Server;

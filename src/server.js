const net = require('net');
const MessageHandler = require('./messageHandler');
const readline = require('readline');
const { Device } = require('../dbServer')
const fs = require('fs').promises;
class Server {
    constructor(port) {
        this.port = port;
        this.clients = [];
    }

    start() {
        const server = net.createServer((socket) => {

            console.log('Cliente conectado');
            const clientInfo = { socket,manufacturerId: null, Name: null ,timerhrst: null, timerTemp: null};
            this.clients.push(clientInfo)

            
            socket.on('data', async (data) => {
                
                const dataString = data.toString();
                if (dataString.startsWith('[') && dataString.endsWith(']') && dataString[4] == "*"){
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
                } else {
                    socket.end();
                    return;
                }
            });

            socket.on('close', () => {
                console.log('Cliente desconectado');
                // Removes socket and info of the device disconnected
                const index = this.clients.findIndex((client) => client.socket === socket);
                if (index !== -1) {
                    const clientInfo = this.clients[index];
                    if (clientInfo.timerhrst) {
                        clearInterval(clientInfo.timerhrst);
                    }
                    if (clientInfo.timerTemp) {
                        clearInterval(clientInfo.timerTemp);
                    }
                    this.clients.splice(index, 1);
                }
            });

            socket.on('error', (error) => {
                console.error('Error en la conexión con el cliente:', error);
                socket.destroy(); // Cierra la conexión del socket de forma forzada
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

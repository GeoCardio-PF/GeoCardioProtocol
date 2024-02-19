const ALMessage = require('./types/ALMessage');
const LKMessage = require('./types/LKMessage');
const UDMessage = require('./types/UDMessage');

class MessageHandler {
    static processMessage(data, socket) {
        const message = data.toString();

        
        if (message.startsWith('[') && message.endsWith(']')){
            const parts = message.slice(1, -1).split('*');

            console.log(`Data recieved: ${message}`);
            switch (true) {
                case parts[3].includes('LK'):
                    const lkMessage = new LKMessage();
                    lkMessage.handle(parts, socket);
                    break;
                case parts[3].includes('TKQ'):
                    const tkqMessage = new TKQMessage();
                    tkqMessage.handle(parts, socket);
                    break;
                case parts[3].includes('UD'):
                    const udMessage = new UDMessage();
                    udMessage.handle(parts, socket);
                    break;
                case parts[3].includes('AL'):
                    const alMessage = new ALMessage();
                    alMessage.handle(parts, socket);
                    break;
                // TODO: ADD MORE CASES
                default:
                    console.log('Formato no manejado actualmente');
            }
        }
        else {
            console.log('Unexpected Format.');
            socket.write('Error: Unexpected Format.');
            socket.end()
        }
        
    }
}

module.exports = MessageHandler;

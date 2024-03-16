const ALMessage = require('./types/ALMessage');
const LKMessage = require('./types/LKMessage');
const UDMessage = require('./types/UDMessage');
const TKQMessage = require('./types/TKQMesage');
const BPHRTMessage = require('./types/BPHRTMessage');
const OXYGENMessage = require('./types/OXYGENMessage');
const BTEMP2Message = require('./types/BTEMP2Message');

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
                case parts[3].includes('bphrt'):
                    const bphrtMessage = new BPHRTMessage();
                    bphrtMessage.handle(parts, socket);
                    break;
                case parts[3].includes('hrstart'):
                    break;
                case parts[3].includes('oxygen'):
                    const oxygenMessage = new OXYGENMessage();
                    oxygenMessage.handle(parts, socket);
                    break;
                case parts[3].includes('btemp2'):
                    const btemp2Message = new BTEMP2Message();
                    btemp2Message.handle(parts, socket);
                    break;
                case parts[3].includes('bodytemp2'):
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

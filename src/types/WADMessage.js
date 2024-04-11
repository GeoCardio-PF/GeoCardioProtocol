
//Request address instruction
//The terminal request address instruction, 
//the address data is the GB232 code, 
//the location type divides into 
//the GPS localization and BASE locates two kinds.

class WADMessage {
    async handle(parts, socket) {
        const manufacturer = parts[0];
        const id = parts[1];
        const data = parts[3];

        let content = 'RAD,GPS,GB232';

        
        let lengthInHex = content.length.toString(16);
        let length = lengthInHex.padStart(4, '0');

        // Terminal response format
        let response = `[${manufacturer}*${id}*${length}*${content}]`;
        console.log(`Enviando: ${response}`);
        socket.write(response);
    }
}

module.exports = WADMessage;

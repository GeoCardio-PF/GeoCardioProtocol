class TKQMessage {
    handle(parts, socket) {
        const manufacturer = parts[0];
        const id = parts[1];
        // LK message is processed.
        
        
        //content of the response
        let content = 'TKQ';


        let lengthInHex = content.length.toString(16);
        let length = lengthInHex.padStart(4, '0');

        // Terminal response format
        let response = `[${manufacturer}*${id}*${length}*${content}]`;
        console.log(`Enviando: ${response}`);
        socket.write(response);
    }
}

module.exports = TKQMessage;

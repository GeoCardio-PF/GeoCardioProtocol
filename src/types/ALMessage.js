const LocationData = require('../models/LocationData')
//Alarm data report
//Terminal sends alarm information to the platform after alarming
//if the terminal has not received the reply
//then regular reporting until receive the alarm confirmation date
class ALMessage {
    handle(parts, socket) {

        const data = parts[3];
        const locData = new LocationData(data);
        // Procesa aquí el mensaje UD

        // Imprimir la información procesada en la consola
        console.log(`Timestamp: ${locData.timestamp}`);
        console.log(`Validity: ${locData.validity}`);
        console.log(`Latitude: ${locData.latitude}`);
        console.log(`Longitude: ${locData.longitude}`);
        console.log(`Speed: ${locData.speed}`);
        console.log(`Direction: ${locData.direction}`);
        console.log(`Satellites: ${locData.satelite}`);
        console.log(`GSM Signal Strength: ${locData.gsmIntensity}`);
        console.log(`Power: ${locData.power}`);
        console.log(`Steps: ${locData.steps}`);
        console.log(`Roll: ${locData.roll}`);
        console.log(`Terminal Information: ${locData.terminal}`);
        
        
        let content = 'AL';


        let lengthInHex = content.length.toString(16);
        let length = lengthInHex.padStart(4, '0');

        // Terminal response format
        let response = `[${manufacturer}*${id}*${length}*${content}]`;
        console.log(`Enviando: ${response}`);
        socket.write(response);
    }
}

module.exports = ALMessage;

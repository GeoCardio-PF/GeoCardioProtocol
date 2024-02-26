const LocationData = require('../models/LocationData')
const { Position } = require('../../dbServer')
//Alarm data report
//Terminal sends alarm information to the platform after alarming
//if the terminal has not received the reply
//then regular reporting until receive the alarm confirmation date
class ALMessage {
    async handle(parts, socket) {
        const manufacturer = parts[0];
        const id = parts[1];
        const data = parts[3];
        //const locData = new LocationData(data);
        // Procesa aquí el mensaje UD

         // Printing the processed information
         console.log(`Timestamp: ${locData.timestamp}`);
         console.log(`Latitude: ${locData.latitude}`);
         console.log(`Longitude: ${locData.longitude}`);
         console.log(`Accuracy: ${locData.accuracy}`);
        
        
        let content = 'AL';

        
        let lengthInHex = content.length.toString(16);
        let length = lengthInHex.padStart(4, '0');

        /*
        try {
            const newPosition = await Position.create({
                DeviceId: id, // Asegúrate de obtener el DeviceId apropiado
                TimeStamp: new Date(locData.timestamp),
                Latitude: locData.latitude,
                Longitude: locData.longitude,
                Accuracy: locData.accuracy, // Asegúrate de que este valor esté disponible y sea correcto
            });
            console.log('New Position saved:', newPosition);
        } catch (error) {
            console.error('Error saving new Position:', error);
        }
        */
        // Terminal response format
        let response = `[${manufacturer}*${id}*${length}*${content}]`;
        console.log(`Enviando: ${response}`);
        socket.write(response);
    }
}

module.exports = ALMessage;

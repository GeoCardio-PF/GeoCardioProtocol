const LocationData = require('../models/LocationData')
const { Position, Alarm } = require('../../dbServer')
//Alarm data report
//Terminal sends alarm information to the platform after alarming
//if the terminal has not received the reply
//then regular reporting until receive the alarm confirmation date
class ALMessage {
    async handle(parts, socket) {
        const manufacturer = parts[0];
        const id = parts[1];
        const data = parts[3];

        if (data.split(',').length>5){
            const locData = new LocationData(data);
            
            await locData.parseData(data);
            // UD message processed.
            
            // Printing the processed information
            console.log(`Timestamp: ${locData.timestamp}`);
            console.log(`Latitude: ${locData.latitude}`);
            console.log(`Longitude: ${locData.longitude}`);
            console.log(`Accuracy: ${locData.accuracy}`);
        
            try {
                const newPosition = await Position.create({
                    DeviceId: id, // Asegúrate de obtener el DeviceId apropiado
                    TimeStamp: new Date(locData.timestamp),
                    Latitude: locData.latitude,
                    Longitude: locData.longitude,
                    Accuracy: locData.accuracy, // Asegúrate de que este valor esté disponible y sea correcto
                });

                const newAlarm = await Alarm.create({
                    DeviceId: id,
                    TimeStamp: new Date(locData.timestamp),
                    Enabled: false
                })
            } catch (error) {
                console.error('Error saving new Position:', error);
            }
            //POSITION DATA REPORT
            //No response to terminal.
        } else {
            let mensaje = data.split(',');
            try {
                const newPosition = await Position.create({
                    DeviceId: id,
                    TimeStamp: new Date(mensaje[1]),
                    Latitude: mensaje[2],
                    Longitude: mensaje[3],
                    Accuracy: 0,
                });
            } catch (error) {
                console.error('Error saving new Position:', error);
            }
       
        // Terminal response format
        let response = `[${manufacturer}*${id}*${length}*${content}]`;
        console.log(`Enviando: ${response}`);
        socket.write(response);
        }
    }
}

module.exports = ALMessage;

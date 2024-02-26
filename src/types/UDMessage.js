const LocationData = require('../models/LocationData')
const { Position } = require('../../dbServer')
const fs = require('fs');
const path = require('path');
//Position data report
//The terminal reports the position and the condition 
//information according to the upload time, does not need the platform reply.
class UDMessage {
    async handle(parts, socket) {
        const id = parts[2];
        const data = parts[3];
        
        
         
        const locData = new LocationData(data);
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
            console.log('New Position saved:', newPosition);
        } catch (error) {
            console.error('Error saving new Position:', error);
        }
        //POSITION DATA REPORT
        //No response to terminal.
    }
    
}

module.exports = UDMessage;

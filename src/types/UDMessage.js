const LocationData = require('../models/LocationData')

//Position data report
//The terminal reports the position and the condition 
//information according to the upload time, does not need the platform reply.
class UDMessage {
    handle(parts, socket) {

        const data = parts[3];
        const locData = new LocationData(data);
        // UD message processed.
        
        // Printing the processed information
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
        
        //content of the response
    

        //POSITION DATA REPORT
        //No response to terminal.
    }
}

module.exports = UDMessage;

const { Temperature } = require('../../dbServer');

class BTEMP2Message {
    async handle(parts, socket) {
        const id = parts[1];
        const dataParts = parts[3].split(',');
        
        const temperatureValue = parseFloat(dataParts[2]);

        try {
            const newTemperature = await Temperature.create({
                DeviceId: id,
                TimeStamp: new Date(),
                Temperature: temperatureValue
            });
            console.log('New Temperature saved:', newTemperature);

        } catch (error) {
            console.error('Error saving new Temperature:', error);
        }
    }
}

module.exports = BTEMP2Message;
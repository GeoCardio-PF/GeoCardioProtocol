const { Temperature } = require('../../dbServer');

class BTEMP2Message {
    async handle(parts, socket) {
        const id = parts[1];
        const dataParts = parts[3].split(',');
        
        const temperatureValue = parseInt(dataParts[2]);

        try {
            const newTemperature = await Temperature.create({
                DeviceId: id,
                TimeStamp: new Date(),
                Temperature: temperatureValue
            });
        } catch (error) {
            console.error('Error saving new Temperature:', error);
        }
    }
}

module.exports = BTEMP2Message;
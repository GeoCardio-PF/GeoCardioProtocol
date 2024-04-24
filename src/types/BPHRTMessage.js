
const { HeartRate } = require('../../dbServer')
//Alarm data report
//Terminal sends alarm information to the platform after alarming
//if the terminal has not received the reply
//then regular reporting until receive the alarm confirmation date
class BPHRTMessage {
    async handle(parts, socket) {

        const id = parts[1];
        const dataParts = parts[3].split(',');
        const heartRateValue = parseInt(dataParts[1], 10);


        try {
            const newHeartRate = await HeartRate.create({
                DeviceId: id, // Asegúrate de obtener el DeviceId apropiado
                TimeStamp: new Date(),
                HeartRate: heartRateValue
            });
        } catch (error) {
            console.error('Error saving new HeartRate:', error);
        }
    }
}

module.exports = BPHRTMessage;

const { Oxygen } = require('../../dbServer')


class OXYGENMessage {
    async handle(parts, socket) {
        const id = parts[1];
        const dataParts = parts[3].split(',');
        const oxygenLevelValue = parseInt(dataParts[2]);
        try {
            const newOxygenLevel = await Oxygen.create({
                DeviceId: id,
                TimeStamp: new Date(),
                Oxygen: oxygenLevelValue
            });
            
        } catch (error) {
            console.error('Error saving new Oxygen Level:', error);
        }
    }
}


module.exports = OXYGENMessage;
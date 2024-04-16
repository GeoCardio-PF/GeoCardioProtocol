const fs = require('fs');
const { HeartRate } = require('./dbServer');
async function generateHeartRateDataInDatabase(startDate, endDate, minHeartRate, maxHeartRate) {
  try {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      let heartRate;
      heartRate = getRandomHeartRate(minHeartRate, maxHeartRate);
      const timestamp = currentDate;

      // Insertar los datos de frecuencia cardíaca en la base de datos
      await HeartRate.create({ DeviceId: '9705083317', HeartRate: heartRate, TimeStamp: timestamp });

      // Avanzar al siguiente intervalo de 10 minutos
      currentDate.setMinutes(currentDate.getMinutes() + 10);
    }

    console.log('Datos de frecuencia cardíaca generados y almacenados en la base de datos.');
  } catch (error) {
    console.error('Error al generar y almacenar datos de frecuencia cardíaca:', error);
  }
}

// Llamar a la función para generar y almacenar datos de frecuencia cardíaca en la base de datos
generateHeartRateDataInDatabase(new Date('2024-04-01'), new Date('2024-04-30'), 60, 110);

// Función para generar un número aleatorio en un rango dado
function getRandomHeartRate(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

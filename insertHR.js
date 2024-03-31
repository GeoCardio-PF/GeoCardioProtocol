	const fs = require('fs');
const { HeartRate } = require('./dbServer');

// Función para insertar los datos de frecuencia cardíaca en la base de datos
async function insertHeartRateDataFromFile(filePath, deviceId) {
  try {
    // Leer el archivo de texto línea por línea
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');

    // Procesar cada línea y crear instancias de HeartRate
    const heartRateData = lines.map(line => {
      const [heartRate, timeStamp] = line.split(',');
      return { DeviceId: deviceId, HeartRate: parseInt(heartRate), TimeStamp: new Date(timeStamp) };
    });

    // Insertar los registros en la base de datos
    await HeartRate.bulkCreate(heartRateData);

    console.log(`Datos de frecuencia cardíaca desde ${filePath} insertados correctamente para el dispositivo ${deviceId}.`);
  } catch (error) {
    console.error(`Error al insertar datos de frecuencia cardíaca desde ${filePath}:`, error);
  }
}

// Función para mostrar la información de la tabla HeartRate en la consola
async function displayHeartRateData() {
  try {
    // Obtener todos los registros de la tabla HeartRate
    const heartRates = await HeartRate.findAll();

    // Mostrar la información en la consola
    console.log('Registros de frecuencia cardíaca:');
    heartRates.forEach(heartRate => {
      console.log(`ID: ${heartRate.HeartRateId}, DeviceId: ${heartRate.DeviceId}, HeartRate: ${heartRate.HeartRate}, TimeStamp: ${heartRate.TimeStamp}`);
    });
  } catch (error) {
    console.error('Error al obtener los datos de frecuencia cardíaca:', error);
  }
}

// Llamar a la función para mostrar la información de la tabla HeartRate
displayHeartRateData(); 

// Llamar a la función para insertar los datos de los archivos de texto
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-13.txt', '9705083317'); // Cambiar 'Device1' al ID deseado
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-14.txt', '9705083317'); // Cambiar 'Device2' al ID deseado
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-15.txt', '9705083317'); // Cambiar 'Device1' al ID deseado
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-16.txt', '9705083317'); // Cambiar 'Device2' al ID deseado
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-17.txt', '9705083317'); // Cambiar 'Device1' al ID deseado
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-18.txt', '9705083317'); // Cambiar 'Device2' al ID deseado
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-19.txt', '9705083317'); // Cambiar 'Device1' al ID deseado
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-20.txt', '9705083317'); // Cambiar 'Device2' al ID deseado
//insertHeartRateDataFromFile('..\\..\\heart_rate_data_2024-03-21.txt', '9705083317'); // Cambiar 'Device2' al ID deseado

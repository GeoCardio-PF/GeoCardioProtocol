const { Temperature } = require('./dbServer');

// Función para generar datos de temperatura corporal para un rango de fechas
async function generateTemperatureDataInDatabase(startDate, endDate, minTemperature, maxTemperature) {
  try {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      let temperature;
      // Generar datos al azar para simular una fiebre leve en los días 29 y 30 de marzo
      if (currentDate.getDate() === 29 || currentDate.getDate() === 30) {
        temperature = getRandomTemperature(37, 39); // Simulación de fiebre leve
      } else {
        temperature = getRandomTemperature(minTemperature, maxTemperature);
      }
      const timestamp = currentDate.toISOString().slice(0, 10);

      // Insertar los datos de temperatura en la base de datos
      await Temperature.create({DeviceId: '9705083317', Temperature: temperature, TimeStamp: timestamp });

      // Avanzar al siguiente hora
      currentDate.setHours(currentDate.getHours() + 1);
    }

    console.log('Datos de temperatura generados y almacenados en la base de datos.');
  } catch (error) {
    console.error('Error al generar y almacenar datos de temperatura:', error);
  }
}

// Llamar a la función para generar y almacenar datos de temperatura en la base de datos
//generateTemperatureDataInDatabase(new Date('2024-03-13'), new Date('2024-03-30'), 35, 37);

// Función para generar un número aleatorio en un rango dado con un decimal incluido
function getRandomTemperature(min, max) {
  return parseInt((Math.random() * (max - min) + min));
}


const { Oxygen } = require('./dbServer');

// Función para generar datos de oxígeno en sangre para un rango de fechas
async function generateOxygenDataInDatabase(startDate, endDate, minOxygen, maxOxygen) {
  try {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const oxygen = getRandomOxygen(minOxygen, maxOxygen);
      const timestamp = currentDate.toISOString().slice(0, 10);

      // Insertar los datos de oxígeno en sangre en la base de datos
      await Oxygen.create({DeviceId: '9705083317', Oxygen: oxygen, TimeStamp: timestamp });

      // Avanzar al siguiente día
      currentDate.setHours(currentDate.getHours() + 2);
    }

    console.log('Datos de oxígeno en sangre generados y almacenados en la base de datos.');
  } catch (error) {
    console.error('Error al generar y almacenar datos de oxígeno en sangre:', error);
  }
}

// Llamar a la función para generar y almacenar datos de oxígeno en sangre en la base de datos
generateOxygenDataInDatabase(new Date('2024-03-13'), new Date('2024-03-23'), 80, 90);

// Función para generar un número aleatorio en un rango dado
function getRandomOxygen(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const { Temperature } = require('./dbServer');
const { Oxygen } = require('./dbServer');


async function generateTemperatureDataInDatabase(startDate, endDate, minTemperature, maxTemperature) {
  try {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      let temperature;
      // Generar datos al azar para simular una fiebre leve en los d�as 29 y 30 de marzo
      if (currentDate.getDate() === 29 || currentDate.getDate() === 30) {
        temperature = getRandomTemperature(37, 39); // Simulaci�n de fiebre leve
      } else {
        temperature = getRandomTemperature(minTemperature, maxTemperature);
      }
      const timestamp = currentDate;

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

// Llamar a la funcin para generar y almacenar datos de temperatura en la base de datos
generateTemperatureDataInDatabase(new Date('2024-04-01'), new Date('2024-04-30'), 35, 37);

// Funcin para generar un nmero aleatorio en un rango dado con un decimal incluido
function getRandomTemperature(min, max) {
  return parseInt((Math.random() * (max - min) + min));
}



// Funcin para generar datos de oxgeno en sangre para un rango de fechas
async function generateOxygenDataInDatabase(startDate, endDate, minOxygen, maxOxygen) {
  try {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const oxygen = getRandomOxygen(minOxygen, maxOxygen);
      const timestamp = currentDate;

      // Insertar los datos de ox�geno en sangre en la base de datos
      await Oxygen.create({DeviceId: '9705083317', Oxygen: oxygen, TimeStamp: timestamp });

      // Avanzar al siguiente d�a
      currentDate.setHours(currentDate.getHours() + 2);
    }

    console.log('Datos de ox�geno en sangre generados y almacenados en la base de datos.');
  } catch (error) {
    console.error('Error al generar y almacenar datos de ox�geno en sangre:', error);
  }
}

// Llamar a la funcin para generar y almacenar datos de ox�geno en sangre en la base de datos
generateOxygenDataInDatabase(new Date('2024-04-01'), new Date('2024-04-30'), 80, 90);

// Funcin para generar un nmero aleatorio en un rango dado
function getRandomOxygen(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

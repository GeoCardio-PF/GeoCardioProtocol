
const axios = require('axios');

class LocationData{
    constructor(dataString) {
        this.parseData(dataString);
    }
    async parseData(dataString) {
        
        const parts = dataString.split(',');

        this.timestamp = this.parseDateTime(parts[1], parts[2]);
        this.validity = parts[3];
        this.latitude = this.parsePosition(parseFloat(parts[4]), parts[5]);
        this.longitude = this.parsePosition(parseFloat(parts[6]), parts[7]);
        this.speed = parseFloat(parts[8]);
        this.direction = parseInt(parts[9]);
        this.elevation = parseInt(parts[10]);
        this.satelite = parseInt(parts[11]);
        this.gsmIntensity = parseInt(parts[12]);
        this.power = parseInt(parts[13]);
        this.steps = parseInt(parts[14]);
        this.roll = parseInt(parts[15]);
        this.terminal = parts[16];
        this.stations = parts[17];
        this.mcc = parts[19];
        this.mnc = parts[20];
        this.accuracy = parts[-1];


        const infoRedesMoviles = extraerInfoRedesMoviles(parts);
        const infoRedesWiFi = extraerInfoRedesWiFi(parts, infoRedesMoviles.indiceFinal);

        const payload = {
            "homeMobileCountryCode": parseInt(this.mcc, 10),
            "homeMobileNetworkCode": parseInt(this.mnc, 10),
            "radioType": "lte",
            "considerIp": false,
            "cellTowers": infoRedesMoviles.CellTowers,
            "wifiAccessPoints": infoRedesWiFi
        }

        await this.fetchLocationFromAPI(payload);

        

    }
    extraerInfoRedesMoviles(parts) {
        // Encuentra el índice donde comienza la información de redes móviles
        // Esto puede ajustarse si la posición inicial cambia basado en la estructura de la trama
        const indiceInicial = 17; // Este índice puede necesitar ajustes
        const cantidadEstaciones = parseInt(parts[indiceInicial], 10);

        if (cantidadEstaciones != 0) {
            

            let estaciones = [];
            let indiceActual = indiceInicial + 4;
    
            for (let i = 0; i < cantidadEstaciones; i++) {
                // Aquí asumimos que cada estación base tiene 5 parts: MCC, MNC, LAC, CellID, señal
                const sid = parts[indiceActual++];
                const nid = parts[indiceActual++];
                const bid = parts[indiceActual++];
                estaciones.push({ "cellId":parseInt(nid,10),"locationAreaCode":parseInt(sid,10),"signalStrength":parseInt(bid,10)});
            }
            
            return { CellTowers: estaciones, indiceFinal: indiceActual };
        } else {
            return { CellTowers: [], indiceFinal: 21 };
        }
    }

    extraerInfoRedesWiFi(partes, indiceInicioWiFi) {
        const cantidadWiFi = parseInt(partes[indiceInicioWiFi], 10);
    
        let wifiAccessPoints = [];
        let indiceActual = indiceInicioWiFi + 1;
    
        for (let i = 0; i < cantidadWiFi; i++) {
            // Asumiendo que cada estación Wi-Fi tiene 3 partes: nombre (vacío), MAC, señal
            indiceActual++; // Saltar el nombre vacío
            const mac = partes[indiceActual++];
            const signalStrength = partes[indiceActual++];
            wifiAccessPoints.push({ "macAddress":mac, "signalStrength":parseInt(signalStrength,10) });
        }
    
        return wifiAccessPoints;
    }

    
    async fetchLocationFromAPI(data) {
        console.log(data);
        try {
            const response = await axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBWemHD1t05Q8_RaZi-WjXqRpzsfytgVtM', data);
            console.log('Ubicación:', response.data);
            this.updateLocation(response.data);
        } catch (error) {
            console.error('Error al obtener la ubicación:', error);
        }
    }

    updateLocation(locationData) {
        this.latitude = locationData.location.lat;
        this.longitude = locationData.location.lng;
        this.accuracy = locationData.accuracy;
    }

    parsePosition(coordinate, direction) {
        if (direction === 'S' || direction === 'W') {
            return -coordinate;
        }
        return coordinate;
    }
     
    parseDateTime(date,time){
        const year = `20${date.slice(4,6)}`; // Assumes a year greater than 1999
        const month = date.slice(2,4);
        const day = date.slice(0,2);
        const hours = time.slice(0,2);
        const minutes = time.slice(2,4);
        const seconds = time.slice(4, 6);
        const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return dateTimeString
    }
}
module.exports = LocationData;
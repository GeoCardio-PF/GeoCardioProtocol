
const axios = require('axios');

class LocationData{
    constructor(dataString) {
        this.parseData(dataString);
    }
    async parseData(dataString) {
        
        const parts = dataString.split(',');

        this.timestamp = this.parseDateTime(parts[1], parts[2]);
        this.validity = parts[3];
        this.latitude = this.parsePosition(parseFloat(parts[4]),parts[5]);
        this.longitude = this.parsePosition(parseFloat(parts[6]),parts[7]);
        this.speed = parseFloat(parts[8]);
        this.direction = parseInt(parts[9]);
        this.satelite = parseInt(parts[11]);
        this.gsmIntensity = parseInt(parts[12]);
        this.power = parseInt(parts[13]);
        this.steps = parseInt(parts[14]);
        this.roll = parseInt(parts[15]);
        this.terminal = parts[16];
        this.station = parts[17];
        this.delay = parts[18];
        this.mcc = parts[19];
        this.mnc = parts[20];
        this.sid = parts[21];
        this.nid = parts[22];
        this.bid = parts[23];
        this.amount = parts[24];
        this.wifi1name = parts[25];
        this.wifi1mac = parts[26];
        this.wifi1sg = parts[27];
        this.wifi2name = parts[28];
        this.wifi2mac = parts[29];
        this.wifi2sg = parts[30];
        this.wifi3name = parts[31];
        this.wifi3mac = parts[32];
        this.wifi3sg = parts[33];
        this.wifi4name = parts[34];
        this.wifi4mac = parts[35];
        this.wifi4sg = parts[36];
        this.wifi5name = parts[37];
        this.wifi5mac = parts[38];
        this.wifi5sg = parts[39];
        this.accuracy = parts[40];

        if (this.validity === "V") {
            await this.extractWiFiAccessPoints(parts);
        }

        

    }
    async extractWiFiAccessPoints(parts) {
        let wifiAccessPoints = [];
        for (let i = 1; i <= 5; i++) {
            const macAddress = this[`wifi${i}mac`];
            const signalStrength = parseInt(this[`wifi${i}sg`], 10);
            if (macAddress && !isNaN(signalStrength)) {
                wifiAccessPoints.push({ macAddress, signalStrength });
            }
        }

        const data = {
            considerIp: "false",
            wifiAccessPoints: wifiAccessPoints,
        };

       await this.fetchLocationFromAPI(data);
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
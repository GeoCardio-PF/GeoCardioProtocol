class LocationData{
    constructor(dataString) {
        this.parseData(dataString);
    }
    parseData(dataString) {
        
        const parts = dataString.split(',');

        this.timestamp = todatetime(parts[1], parts[2]);
        this.validity = parts[3];
        this.latitude = position(parseFloat(parts[4]),parts[5]);
        this.longitude = position(parseFloat(parts[4]),parts[5]);
        this.speed = parseFloat(parts[8]);
        this.direction = parseInt(parts[9]);
        this.satelite = parseInt(parts[11]);
        this.gsmIntensity = parseInt(parts[12]);
        this.power = parseInt(parts[13]);
        this.steps = parseInt(parts[14]);
        this.roll = parseInt(parts[15]);
        this.terminal = parts[16];

    }
    position(coordinate, direction) {
        if (direction === 'S' || direction === 'W') {
            return -coordinate;
        }
        return coordinate;
    }
    todatetime(date,time){
        const year = `20${date.slice(4,6)}`; // Asume un año 2000+
        const month = date.slice(2,4);
        const day = date.slice(0,2);
        const hours = time.slice(0,2);
        const minutes = time.slice(2,4);
        const seconds = time.slice(4, 6);
        const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return dateTimeString
    }
}
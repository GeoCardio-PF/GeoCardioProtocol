const Server = require('./src/server');

const port = 7878;
const server = new Server(port);
server.start();

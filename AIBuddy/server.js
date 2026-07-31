const app = require('./src/app');
require('dotenv').config();


//socket initialize
const http = require('http');
const initializeSocketServer = require('./src/sockets/socket.server');
const httpServer = http.createServer(app);
initializeSocketServer(httpServer);


httpServer.listen(3005, () => {
  console.log('AI-Buddy Server is running on port 3005');
});
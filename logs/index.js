const winstonServer = require('winston-dashboard')
const path = require('path')

// Instantiate the server
winstonServer({
  path: path.join(__dirname, '/logs'), // Root path of the logs
  logFiles: '/**/*.log', // Glob to search for logs, make sure you start with a '/'
  port: process.env.PORT,
  orderBy: 'creationTime'
});

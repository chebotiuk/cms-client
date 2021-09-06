import winston from 'winston'
import fs from 'fs'

const NODE_ENV = process.env.NODE_ENV
const filename = 'logs/all.log'

function createLogger(module: NodeModule) {
  const path = module.filename.split('/').slice(-2).join('/')

  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: NODE_ENV == 'development' ? 'debug' : 'info',
        label: path
      }),
      new (winston.transports.File)({ filename, level: 'debug' })
    ]
  })
}

createLogger.logAnUncaughtException = function (err: Error) {
  console.error("\x1b[41m", 'UNCAUGHT EXCEPTION', "\x1b[0m")
  console.error('\n', err, '\n')
  console.error("\x1b[41m", 'END', "\x1b[0m")

  fs.appendFileSync(
    filename,
    JSON.stringify({ message: "ok", stack: err.stack, level: "error", timestamp: new Date().toISOString() }) + '\n'
  )
}

export default createLogger

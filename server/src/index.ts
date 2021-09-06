import { db } from './libs/db'
import log from './libs/logger'
import { initServer } from './server'

process.on('uncaughtException', (err) => {
  log.logAnUncaughtException(err)
  process.exit(1)
})

db.init()
  .then(initServer)
  .catch(err => { throw new Error(err) })

// setInterval(function () {
//   const used = process.memoryUsage()

//   for (let key in used) {
//     // @ts-ignore
//     const usedMem = used[key]
//     console.log(`${key} ${Math.round(usedMem / 1024 / 1024 * 100) / 100} MB`);
//   }

//   console.log(`\n -------------------------------------------- \n`)
// }, 3000);

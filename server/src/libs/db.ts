import { MongoClient, Db } from 'mongodb'

import config from '../config'
import createLogger from './logger'

const log = createLogger(module)

const url = config.get('db:url')
const name = config.get('db:name')

let mongoConnection: Db

const init = () => {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function (err: Error | null, client) {
      if (err) return reject(err)

      log.info("mongo native driver connected");

      mongoConnection = client.db(name)
      return resolve(mongoConnection)
    })
  })
}

const getInstance = () => {
  if (mongoConnection) return mongoConnection

  throw new Error('Cannot get mongodb connection, pleas wait until mongodb connected...')
}

export const db = {
  init,
  getInstance,
}

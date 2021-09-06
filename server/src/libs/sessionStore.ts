import session from 'express-session'
import connectMongo from 'connect-mongo'
import { db } from './db';

const MongoStore = connectMongo(session)

export default new MongoStore({ db: db.getInstance() })

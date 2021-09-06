import crypto from 'crypto'
import { Model, ModelError } from './Model'
import { ObjectId } from 'bson'

export enum UserTypes {
  admin = 'admin',
  service = 'service',
  client = 'client',
  whosaleClient = 'whosaleClient',
}

type UserInput = {
  username: string
  password: string
  type?: UserTypes
  email?: string
}

export interface IUserDocument extends User {
  _id: ObjectId
}

const encryptPassword = (
  password: string,
  salt: string
) => crypto.createHmac('sha1', salt).update(password).digest('hex')

export class User {
  [key: string]: any
  public _id?: ObjectId
  public username: string
  public type: UserTypes.admin | UserTypes.service | UserTypes.client | UserTypes.whosaleClient
  public password: string
  public email: string | null
  public salt: string
  public hashedPassword: string
  public createdAt?: number

  constructor (
    user: UserInput
  ) {
    this.username = user.username
    this.type = user.type || UserTypes.client
    this.password = user.password
    this.email = user.email || null
    this.salt = Math.random() + ''
    this.hashedPassword = encryptPassword(this.password, this.salt)
    this.createdAt = Date.now()
  }
}

class UserModel extends Model {
  collectionName = 'users'

  getDefaultValues = () => ({
    username: UserTypes.service,
    email: null
  }) as Omit<IUserDocument, "_id">

  indexes = [
    [{ username: 1 }, { unique: true, sparse: true }]
  ]

  resolvers = {}

  constructor () {
    super()
    this.createIndexes()
  }

  public createUser = (user: UserInput) =>
    this.createOne(new User(user))

  public readByUsername = (username: string) => this.collection.findOne({ username })

  public checkPassword = async (userId: string | ObjectId, password: string) => {
    const user = await this.readOneById(userId)

    if (!user) throw new ModelError('Base dependency document not found')

    return encryptPassword(password, user.salt) === user.hashedPassword
  }
}

export const userModel = new UserModel

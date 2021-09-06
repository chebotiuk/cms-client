import util from 'util'

import { db } from '../libs/db'
import createLogger from '../libs/logger'
import { ObjectId } from 'bson'
import { IObject } from '../@types'
import { CommonOptions, FindOneOptions, UpdateManyOptions, UpdateOneOptions } from 'mongodb'

export type Document = { [key: string]: any }
export type Resolvers = { [key: string]: (document: any) => Promise<any> }

export type Attributes = {
  sort?: string
  order?: "asc" | "desc"
  filter?: IObject
  projection?: IObject
  skip?: number
  limit?: number
}

const log = createLogger(module)

type modelErrorMsgs = 'Base dependency document not found'

export class ModelError {
  name: string | undefined

  constructor(public message?: modelErrorMsgs) {
    Error.captureStackTrace(this, ModelError)

    this.message = message
  }
}

util.inherits(ModelError, Error)
ModelError.prototype.name = 'ModelError'

export abstract class Model {
  db = db.getInstance()
  abstract collectionName: string
  abstract indexes: Array<Array<object>>
  abstract getDefaultValues: () => ({ [key: string]: any })
  abstract resolvers: Resolvers

  public get collection() {
    return this.db.collection(this.collectionName)
  }

  private handleIndexCreationCallback = <T extends Error>(err: T | null, result: string) => {
    if (err) return log.error(err.toString())
  
    log.debug(result + ': index created in ' + this.collectionName + ' collection')
  }

  protected createIndexes = async () => {
    await this.db.createCollection(this.collectionName)
    await this.collection.dropIndexes()

    if (this.indexes && this.indexes.length !== 0) {
      for (const index of this.indexes) {
        const [fieldset, options = {}] = index

        this.collection.createIndex(
          fieldset,
          { background: true, ...options },
          this.handleIndexCreationCallback,
        )
      }
    }
  }

  public createOne = (item: IObject): Promise<any> =>
    this.collection.insertOne({ ...this.getDefaultValues(), ...item })
      .then((result: {
        ops: Array<object>
      }) => {
        const { ops: [document] } = result
        return document
      })

  public readAll = (
    { sort, order, filter = {}, projection, skip, limit }: Attributes = {},
    options?: FindOneOptions | undefined 
  ) => {
    let cursor = this.collection.find(
      { ...filter }, 
      options
    )
  
    if (skip) cursor.skip(skip)
    if (limit) cursor.limit(limit)
    if (sort) cursor.sort({ [sort]: order === 'asc' ? 1 : -1 })

    return cursor
  }

  public readPageInfo = async (
    { filter, skip, limit }: Attributes = {}
  ) => {
    const overallDocsAmount = await this.collection.countDocuments(filter)
    const pages = limit ? Math.ceil(overallDocsAmount / limit) : 1
    const hasNext = (limit !== undefined && skip !== undefined)
      ? (skip + limit) < overallDocsAmount
      : undefined
    const hasPrevious = (limit !== undefined && skip !== undefined) ? skip !== 0 : undefined

    return {
      overallDocsAmount,
      pages,
      hasNext,
      hasPrevious,
      skip,
      limit
    }
  }

  public readOneById = (
    id: string | ObjectId,
    attr: Attributes = {},
    options?: FindOneOptions | undefined
  ) => this.collection.findOne(
    { _id: new ObjectId(id) },
    options
  )

  public updateOneById = (
    id: string | ObjectId,
    update: Object,
    options?: UpdateOneOptions | undefined
  ) => this.collection.updateOne({ _id: new ObjectId(id) }, { $set: update }, options)
      .then(() => this.readOneById(id))

  public updateManyByIds = (
    ids: Array<ObjectId | string>,
    update: Object,
    options?: UpdateManyOptions | undefined
  ) => this.collection.updateMany({ _id: { $in: ids } }, { $set: update }, options)

  public deleteOneById = (
    id: ObjectId | string,
    options?: CommonOptions & {
      bypassDocumentValidation?: boolean | undefined
    }
  ) => this.collection.deleteOne({ _id: new ObjectId(id) }, options)

  public deleteManyByIds = (
    ids: Array<ObjectId | string>,
    options?: CommonOptions | undefined
  ) => this.collection.deleteMany({ _id: { $in: ids } }, options)

  public resolveDocument = async (
    document: Document,
    resolvers: Resolvers,
    projection?: object,
  ) => {
    if (!projection) projection = { ...resolvers, ...document }

    const result: IObject = {}

    for (const key in projection) {
      if (resolvers[key]) {
        result[key] = await resolvers[key](document)
        continue
      }

      result[key] = document[key]
    }

    return result
  }
}

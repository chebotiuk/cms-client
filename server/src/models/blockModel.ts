import { Model } from './Model'

export type BlockInput = {
  key: string
  textBlock: string
}

interface IBlockDocument {
  _id: string
  key: string
  textBlock: string
}

class BlockModel extends Model {
  collectionName = 'blocks'

  getDefaultValues = () => ({
    key: 'block',
    textBlock: ""
  }) as Omit<IBlockDocument, "_id">

  indexes = [
    [{ key: 1 }, { sparse: true }]
  ]

  resolvers = {}

  readOneByKey = async (key: string) => {
    const document: IBlockDocument | null = await this.collection.findOne({ key })

    if (!document) return null

    return this.resolveDocument(document, this.resolvers)
  }

  constructor() {
    super()
    this.createIndexes()
  }
}

export const blockModel = new BlockModel

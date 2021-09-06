import { Model, Attributes } from './Model'
import { parsePrice } from '../libs/math'

export type OptionInput = {
  key: string
  marginRatio: number | null
  wholesalePrice: number | null
  price: number | null
  group?: string
}

interface IOptionDocument {
  _id: string
  key: string
  marginRatio: number | null
  wholesalePrice: number | null
  price: number | null
  group: string | null
}

class OptionModel extends Model {
  collectionName = 'options'

  getDefaultValues = () => ({
    key: '',
    wholesalePrice: null,
    marginRatio: 1,
    price: null,
    group: null,
  }) as Omit<IOptionDocument, "_id">

  indexes = [
    [{ group: 1 }, { sparse: true }]
  ]

  resolvers = {
    accountedPrice: async ({ wholesalePrice, marginRatio, price }: IOptionDocument) =>
      parsePrice(wholesalePrice, marginRatio, price)
  }

  readOptionById = async (id: string, attr: Attributes = {}) => {
    const document: IOptionDocument = await this.readOneById(id, attr)

    if (!document) return null

    return this.resolveDocument(document, this.resolvers, attr.projection)
  }

  readOptionByGroup = async (group: string) => {
    const document: IOptionDocument | null = await this.collection.findOne({ group })

    if (!document) return null

    return this.resolveDocument(document, this.resolvers)
  }

  readAllOptions = async (attr: Attributes = {}) => {
    const cursor = this.readAll(attr)
    const options = []

    for await (const document of cursor) {
      options.push(this.resolveDocument(document, this.resolvers, attr.projection))
    }

    return Promise.all(options)
  }

  createOptions = async (option: OptionInput) => {
    const document = await this.createOne(option)
    return this.resolveDocument(document, this.resolvers)
  }

  updateOptionById = (id: string, update: Object): Promise<any> =>
    this.updateOneById(id, update)
      .then((option: IOptionDocument) => this.resolveDocument(option, this.resolvers))

  constructor() {
    super()
    this.createIndexes()
  }
}

export const optionModel = new OptionModel

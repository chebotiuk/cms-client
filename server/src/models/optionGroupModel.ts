import { Model } from './Model'

export type OptionGroupInput = {
  key: string
  marginRatio: number | null
  wholesalePrice: number | null
  price: number | null
  group?: string
}

interface IOptionGroupDocument {
  _id: string
  key: string
  marginRatio: number | null
  wholesalePrice: number | null
  price: number | null
  group: string | null
}

class OptionGroupModel extends Model {
  collectionName = 'options'

  getDefaultValues = () => ({
    key: '',
    wholesalePrice: null,
    marginRatio: 1,
    price: null,
    group: null,
  }) as Omit<IOptionGroupDocument, "_id">

  indexes = []

  resolvers = {}

  constructor() {
    super()
    this.createIndexes()
  }
}

export const optionGroupModel = new OptionGroupModel

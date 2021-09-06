import { Model } from './Model';

export type CategoryInput = {
  name: string
}

interface ICategoryDocument {
  _id: string
  name: string
}

class CategoryModel extends Model {
  collectionName = 'categories'

  getDefaultValues = () => ({
    name: 'Unnamed category'
  }) as Omit<ICategoryDocument, "_id">

  indexes = []

  resolvers = {}

  constructor() {
    super()
    this.createIndexes()
  }
}

export const categoryModel = new CategoryModel

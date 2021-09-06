import { Model } from './Model';

export type TemplateInput = {
  name: string
  items: Array<string>
}

interface ITemplateDocument {
  _id: string
  name: string
  items: Array<string>
}

class TemplateModel extends Model {
  collectionName = 'templates'

  getDefaultValues = () => ({
    name: 'Unnamed template',
    items: []
  }) as Omit<ITemplateDocument, "_id">

  indexes = []

  resolvers = {}

  constructor() {
    super()
    this.createIndexes()
  }
}

export const templateModel = new TemplateModel

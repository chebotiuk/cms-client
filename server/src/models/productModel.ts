import { Model, Attributes } from './Model'
import { categoryModel } from './categoryModel'
import { ObjectId } from 'bson'
import { optionModel } from './optionModel'
import { randomInteger, parsePrice } from '../libs/math'

type PriceInput = {
  key: string
  marginRatio: number | null
  wholesalePrice: number | null
  price: number | null
}

export type ProductInput = {
  article?: number,
  name: string,
  shortDescription?: string,
  description?: string,
  prices?: Array<PriceInput>,
  hidden?: boolean,
  categoryIds?: Array<string>,
  fileIds?: Array<string>,
  additionalOptions?: Array<PriceInput>
  optionIds?: Array<string>
}

export interface IProductDocument {
  _id: string
  article: number
  name: string
  shortDescription: string,
  description: string
  wholesalePrice: number | null
  prices: Array<PriceInput>,
  marginRatio: number | null
  hidden: boolean
  categoryIds: ReadonlyArray<string>
  fileIds: ReadonlyArray<string>
  optionIds: ReadonlyArray<string>
  additionalOptions: ReadonlyArray<PriceInput>
}

class ProductModel extends Model {
  collectionName = 'products'

  getDefaultValues = () => ({
    name: '',
    article: randomInteger(10000, 99999),
    shortDescription: '',
    description: '',
    wholesalePrice: null,
    prices: [],
    marginRatio: null,
    hidden: false,
    categoryIds: [],
    fileIds: [],
    optionIds: [],
    additionalOptions: [],
  }) as Omit<IProductDocument, "_id">

  indexes = [
    [{ article: 1 }, { unique: true, sparse: true }]
  ]

  uploadsCollection = this.db.collection('uploads')

  resolvers = {
    files: async ({ fileIds }: IProductDocument) => await Promise.all(
      fileIds.map((id: string) => this.uploadsCollection.findOne({ _id: new ObjectId(id) }, {
        projection: { filename: 1 }
      }))
    ),
    categories: async ({ categoryIds }: IProductDocument) =>
      await categoryModel.collection.find({ _id: { $in: categoryIds.map(id => new ObjectId(id)) } }).toArray(),
    options: async({ optionIds }: IProductDocument) =>
      await optionModel.collection.find({ _id: { $in: optionIds.map(id => new ObjectId(id)) } }).toArray(),
    prices: async ({ prices }: IProductDocument) =>
      prices.map(({ key, wholesalePrice, marginRatio, price }) => ({
        key,
        wholesalePrice,
        marginRatio,
        price,
        accountedPrice: parsePrice(wholesalePrice, marginRatio, price)
      })),
    additionalOptions: async ({ additionalOptions }: IProductDocument) =>
      additionalOptions.map(({ key, wholesalePrice, marginRatio, price }) => ({
        key,
        wholesalePrice,
        marginRatio,
        price,
        accountedPrice: parsePrice(wholesalePrice, marginRatio, price)
      }))   
  }

  readProductById = async (id: string | ObjectId, attr: Attributes = {}) => {
    const document: IProductDocument = await this.readOneById(id, attr)

    if (!document) return null

    return this.resolveDocument(document, this.resolvers, attr.projection)
  }

  readAllProducts = async (attr: Attributes = {}) => {
    const cursor = this.readAll(attr)
    const products = []

    for await (const document of cursor) {
      products.push(this.resolveDocument(document, this.resolvers, attr.projection))
    }

    return Promise.all(products)
  }

  readAllProductsWithPageInfo = async (attr: Attributes) => ({
    records: await this.readAllProducts(attr),
    pageInfo: await this.readPageInfo(attr)
  })

  createProduct = async (product: ProductInput) => {
    const document = await this.createOne(product)
    return this.resolveDocument(document, this.resolvers)
  }

  updateProductById = (id: string, update: Object): Promise<any> =>
    this.updateOneById(id, update)
      .then((product: IProductDocument) => this.resolveDocument(product, this.resolvers))

  constructor() {
    super()
    this.createIndexes()
  }
}

export const productModel = new ProductModel

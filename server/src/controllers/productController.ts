import { Req, Res, Next } from '../server'
import { productModel } from '../models/productModel'
import { HttpError } from '../libs/error'
import uploadController from './uploadController'

class ProductsController {
  public read (req: Req, res: Res, next: Next) {
    productModel.readAllProducts(req.attr)
      .then(products => { res.json(products) })
      .catch(next)
  }

  public readPage = (req: Req, res: Res, next: Next) => {
    productModel.readAllProductsWithPageInfo(req.attr)
      .then(products => { res.json(products) })
      .catch(next)
  }

  public readOne = async (req: Req, res: Res, next: Next) => {
    let product = null

    try {
      product = await productModel.readProductById(req.params.id, req.attr)
    } catch (err) {
      return next(err)
    }

    if (!product) return next(new HttpError(404, 'Product not found'))

    res.json(product)
  }

  public createOne (req: Req, res: Res, next: Next) {
    const product = req.body

    productModel.createProduct(product)
      .then(product => res.json(product))
      .catch(next)
  }

  public updateOne (req: Req, res: Res, next: Next) {
    const product = req.body
    const { id } = req.params

    productModel.updateProductById(
      id,
      product
    )
      .then(product => { res.json(product) })
      .catch(next)
  }

  public async deleteOne (req: Req, res: Res, next: Next) {
    const { id } = req.params

    const product = await productModel.readOneById(id)

    if (!product) return next(new HttpError(400, 'No product found to remove'))

    try {
      // to-do: replace collection model returns with generic types
      const { fileIds } = product

      const { result: { n } } = await productModel.deleteOneById(id)
      if (n !== 1) throw new Error("Product hasn't been removed, something went wrong...")

      if (fileIds && fileIds.length !== 0) uploadController.cleanup(fileIds)
    } catch (err) {
      return next(err)
    }

    res.json("")
  }
}

const productsController = new ProductsController()
export default productsController

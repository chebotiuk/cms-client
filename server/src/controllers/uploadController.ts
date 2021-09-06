import util from 'util'
import sharp from 'sharp'
import zlib from 'zlib'
import { ObjectId } from 'bson'
import { Readable } from 'stream'

import { Req, Res, Next } from '../server'
import { HttpError } from '../libs/error'
import { db } from '../libs/db'
import { once } from '../libs/lib'

export const IMAGE_SIZE = 1280
export const IMAGE_SIZE_PREVIEW = 300

function getFileName(req: Req) {
  var filename = ""
  var disposition = req.headers['content-disposition']

  if (disposition && disposition.indexOf('attachment') !== -1) {
    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    var matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  return filename
}

function sendImage(stream: any, size: number = IMAGE_SIZE, res: Res, next: Next) {
  res.setHeader('Content-Encoding', 'gzip')
  const gzipStream = zlib.createGzip()
  next = once(next)

  stream.on('error', next)
  gzipStream.on('error', next)

  res.on('close', function () {
    stream.destroy()
    gzipStream.destroy()
  })

  stream.pipe(gzipStream).pipe(res)
}

const readUpload = (stream: any) => new Promise((resolve, reject) => {
  let data: Uint8Array[] = []

  stream.on('error', reject)
        .on('data', (chunk: any) => {
          data.push(chunk)
        }).on('end', () => {
          resolve(Buffer.concat(data))
        })
})

class UploadController {
  get collection() {
    const mongodb = db.getInstance()
    return mongodb.collection('uploads')
  }

  public createOne = async (req: Req, res: Res, next: Next) => {
    let inputBuffer
    let file
    let data
    let dataPreview
    const filename = getFileName(req)

    try {
      inputBuffer = await readUpload(req)
      data = await sharp(inputBuffer).resize(IMAGE_SIZE).toBuffer()
      dataPreview = await sharp(inputBuffer).resize(IMAGE_SIZE_PREVIEW).toBuffer()

      const { ops: [document] } = await this.collection.insertOne({
        data,
        type: req.headers['content-type'] || null,
        filename
      })

      await this.collection.insertOne({
        data: dataPreview,
        type: req.headers['content-type'] || null,
        filename: 'sm_' + filename
      })

      file = document
    } catch (err) {
      return next(new HttpError(500, err.message))
    }

    res.json({
      file,
    })
  }

  public readOne = async (req: Req, res: Res, next: Next) => {
    var { data, type } = await this.collection.findOne({
      $or: [{ _id: new ObjectId(req.params.id) }, { filename: req.params.filename }]
    }) || {}

    res.setHeader('Content-Type', type)

    if (req.query.size && ['image/jpeg', 'image/png'].includes(type)) {
      const readable = new Readable()
      readable.push(data.buffer)
      readable.push(null)

      return sendImage(readable, req.query.size, res, next)
    }

    res.end(data.buffer)
  }

  public deleteOne = (req: Req, res: Res, next: Next) => {
    this.collection.deleteOne({ _id: new ObjectId(req.params.id) })
      .then(() => {
        res.status(200)
           .json({})
      })
      .catch(next)
  }

  public cleanup = (fileIds: Array<string>) => {
    return Promise.all(fileIds.map(
      id => this.collection.deleteOne({ _id: new ObjectId(id) })
    ))
  }
}

const uploadController = new UploadController()
export default uploadController

import {Request, Response, NextFunction, Router} from 'express'
import * as HttpStatus from 'http-status-codes'
import { requestParamsValidatorMiddleware } from '../../helpers'
import { IndexPostValidationPipeline } from '../../validator'
import {MainUseCase} from '../../../use-cases/index'
import {MainDB} from '../../../app-plugins/persistence/db'
import * as fs from 'fs'
const multiPartMiddleWare = require('connect-multiparty')()
export default class _Router {
  /**
   * @class initiate router class
   */
  private readonly router: Router
  private requestCounter = 0
  private uploadedMedia = <any[]>[]
  constructor () {
    this.router = Router({mergeParams: true})
    
  }
  private listRoute = (req: Request, res: Response, next: NextFunction) => {
    new MainUseCase(new MainDB())
      .findAllMain(req.query)
      .then((response) => {
        res.status(HttpStatus.OK).send({result: true, data: response})
      })
      .catch(err => {
        console.log(' > err', err)
        res.status(HttpStatus.BAD_REQUEST).send({result: false, error: err.message})
      })
  }
  private addRoute = (req: Request, res: Response, next: NextFunction) => {
    // const data = req.body
   
  }
  private uploadRoute = (req: Request, res: Response, next: NextFunction) => {
    // const data = req.body
    const {media = ''} = req.body
    const index = this.uploadedMedia.findIndex((media) => media._id === media._id)
    if (index === -1) {
      this.uploadedMedia.push(media)
    }
    const fileLocation = __dirname.concat(`/../../../../temp/${media._id}`)
    // delete media.mediaBased64String
    const writableStream = fs.createWriteStream(fileLocation, {flags: 'as', encoding: 'utf8'})
    writableStream.write(media.mediaBased64String)
    if (media.last) {
      let based64 = <string>''
      const writableStream = fs.createReadStream(fileLocation, {encoding: 'utf8'})
      writableStream.on("data", (chunk) => {
        based64 = based64.concat(chunk.replace("data:image/png;base64,", ""))
      })
      writableStream.on("end", () => {
        const imageBinary = Buffer.from(based64, 'base64')
        // console.log(' > imageBinaxxry: ', imageBinary)
        fs.writeFile(`${fileLocation}.png`, imageBinary, (err: any) => {
        })
      })
    }
    res.end()
  }
  private getByIdRoute = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatus.OK).send({result: true})
  }
  private updateRoute = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatus.ACCEPTED).send({result: true})
  }
  private deleteRoute = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatus.ACCEPTED).send({result: true})
  }
  public expose () {
    this.router.get('/', this.listRoute)
    this.router.post('/',
      // requestParamsValidatorMiddleware(IndexPostValidationPipeline),
      this.addRoute
    )
    this.router.post('/upload',
      multiPartMiddleWare,
      // requestParamsValidatorMiddleware(IndexPostValidationPipeline),
      this.uploadRoute
    )
    this.router.get('/:id', this.getByIdRoute)
    this.router.put('/:id', this.updateRoute)
    this.router.delete('/:id', this.deleteRoute)
    return this.router
  }
}
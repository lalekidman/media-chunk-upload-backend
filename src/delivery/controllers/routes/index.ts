import {Request, Response, NextFunction, Router} from 'express'
import HttpStatus from 'http-status-codes'
import fs from 'fs'
import Busboy from 'busboy'
const multiPartMiddleWare = require('connect-multiparty')()
const mediaPattern = /^(image\/png|video\/mp4)$/i

const getBlobpath = (fileId: string) => {
  return __dirname.concat(`/../../../../uploads/${fileId}`)
}
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, __dirname.concat('/../../../../uploads'))
//   },
//   filename: (req, file, callback) => {
//     const fileId = req.headers['x-file-id']
//     callback(null, `${file.destination}/${fileId}`)
//   }
// })
// const uploader = multer({storage})
export default class _Router {
  /**
   * @class initiate router class
   */
  private readonly router: Router
  constructor () {
    this.router = Router({mergeParams: true})
    
  }
  private busboyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    var busboy = new Busboy({ headers: req.headers });
    const fileId = req.headers['x-file-id'] as string
    const fileSize = parseInt(req.headers['x-file-size'] as string)
    console.log('fileSize :>> ', fileSize);
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      const blobFlag = fs.existsSync(getBlobpath(fileId)) ? 'a' : 'w'
      file.pipe(fs.createWriteStream(getBlobpath(fileId), {flags: blobFlag}));
      file.on('end', function() {
        const stats = fs.statSync(getBlobpath(fileId))
        if (stats.size === fileSize) {
          console.log('##########################3 SHOULD CALL NEXT ROUTE');
        } else {
          console.log('########################## SHOULD CALL RESPONSE HTTP');
        }
      });
    });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
    req.pipe(busboy)
  }
  private listRoute = (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(HttpStatus.OK)
  }
  private addRoute = (req: Request, res: Response, next: NextFunction) => {
    // const data = req.body
  }
  private uploadRoute = (req: Request, res: Response, next: NextFunction) => {
    // const data = req.body
    // res.end()
    // let {last = '', _id = '', mediaBuffer} = req.body
    // if (req.file.path) {}
    // const {media} = req.files
  //   last = parseInt(last)
  //   const fileId = rs.generate({length: 6, charset: 'alphabetic'})
  //   // console.log("       ", Buffer.from(media, 'base64'))
  //   //   const mediaType = <string> media.mediaType
  // //   const fileExtension = mediaType.match(mediaPattern) ? media.mediaType.split("/")[1] : ""
  // //   const index = this.uploadedMedia.findIndex((media) => media._id === media._id)
  // //   if (index === -1) {
  // //     this.uploadedMedia.push(media)
  // //   }
  //   const dir = __dirname.concat(`/../../../../temp/${_id}`)
  //   const fileLocation = dir.concat(`/${fileId}.part`)
  //   if (!fs.existsSync(dir)){
  //     fs.mkdirSync(dir);
  //   }
  //   // fs.createWriteStream(fileLocation, {flags: 'as'})
  //   const writableStream = fs.createWriteStream(fileLocation, {flags: 'as', encoding: 'base64'})
  //   writableStream.once("open", () => {
  //     writableStream.write(mediaBase64URL)
  //     writableStream.end()
  //   })
    // if (last) {
    //   let based64 = <string>''
    //   const readableStream = fs.createReadStream(fileLocation, {encoding: 'utf8'})
    //   // readableStream.on("data", (chunk) => {
    //   //   based64 = based64.concat(chunk.replace(/(data\:application\/octet\-stream\;base64\,|data\:image\/png\;base64\,)/, ""))
    //   //   // based64 = based64.concat(chunk.replace("data:image/png;base64,", ""))
    //   // })
    //   // readableStream.on("end", () => {
    //   //   // const imageBinary = Buffer.from(based64, 'base64')

    //   //   fs.writeFile(`${fileLocation}.${fileExtension}`, based64, 'base64', (err: any) => {
    //   //     // fs.unlinkSync(fileLocation)
    //   //   })
    //   // })
    // }
    res.end()
  }
  private concatUploadedMediaRoute = (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    const dir = __dirname.concat(`/../../../../temp/${id}`)
    fs.readdir(`${dir}`, {encoding: "utf8"}, async (err, files) => {
      if (err) {
      }
      let mediaBase64 = ''
      for (const file of files) {
        const chunkedMedia = await fs.readFileSync(`${dir}/${file}`, 'base64')
        mediaBase64 = mediaBase64.concat(chunkedMedia)
      }
      fs.writeFile(`${dir}/image.png`, mediaBase64, (err: any) => {
        // fs.unlinkSync(fileLocation)
      })
      mediaBase64
      console.log(" data: ", files)
    })
    console.log("_id: ", id)
    res.status(HttpStatus.OK).send({result: true})
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
      this.busboyMiddleware,
      this.uploadRoute
    )
    this.router.post('/upload/concat/:id',
      // requestParamsValidatorMiddleware(IndexPostValidationPipeline),
      this.concatUploadedMediaRoute
    )
    this.router.get('/:id', this.getByIdRoute)
    this.router.put('/:id', this.updateRoute)
    this.router.delete('/:id', this.deleteRoute)
    return this.router
  }
}
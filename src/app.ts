require('dotenv').config({path: `${__dirname}/../.env`})
import express from 'express'
import {Request, Response, NextFunction} from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import passport from 'passport'
import HttpStatus from 'http-status-codes'
import morgan from 'morgan'
import session from 'express-session';
import cookieParser from 'cookie-parser'

import flash = require('connect-flash')

import {Server as SocketServer} from 'socket.io'
import socketio from 'socket.io'
import {createServer, Server} from 'http'
import DB from './app-plugins/persistence/db'
import { DB_HOST, DB_NAME, SERVER_PORT } from './delivery/utils/constants'

// publishers and streamers
// import MainPublisher from './publishers/index'
// import MainStreamer from './streamers/index'

import MainRoute from './delivery/controllers/routes'
const SECRET = 'A_SAMPLE_SECRET_FOR_SESSION_EXPRESS'
// import MongoOplog from 'mongo-oplog'
// import {} from 'mongo-oplog'
// import { Db } from 'mongodb';

class App {
  public app: any
  public io: any
  public HttpServer: Server
  //@ts-ignore
  public server: SocketServer
  private Port:(number | string)
  constructor () {
    this.app = express()
    this.HttpServer = createServer(this.app)
    this.Port = SERVER_PORT
    this.loadMiddleWares()
  }
  private mountRoutes (): void {
    // Where the router import
    this.app.use(new MainRoute().expose())
  }
  private connectWebSocket (server: any):void {
    this.io = socketio(server)
    this.io.on('connect' , (socket: socketio.Socket) => {
      console.log('someone is connected, ', socket.handshake.headers.authorization)
      // setTimeout(() => {
      //   socket.disconnect();
      // }, 3000)
      socket.on('disconnect' , () => {
        console.log('user:', socket.id)
        console.log('user disconnected')
      })
    })
  }
  private async connectDatabase () {
    // await new DB(DB_HOST, DB_NAME).connect()
    //   ?.then(() => {
    //     // new MainPublisher().publish()
    //     // new MainStreamer().stream()
    //   })
  }
  public listen (port?: number):void {
    this.server = this.app.listen(port || this.Port, () => {
      console.log(`Listening to port ${this.Port}`)
    })
    this.connectWebSocket(this.server)
  }
  private loadMiddleWares () { 
    
    this.app.use(morgan('dev'))
    // this.app.use(express.static(path.join(__dirname, '../views')))
    // this.app.set('views', path.join(__dirname, '../views'))
    this.app.set('view engine', 'hbs')
    this.app.use(cookieParser())
    this.app.use(bodyParser.json({limit: "150mb"}))
    this.app.use(bodyParser.urlencoded({ extended: false, limit: "200mb" }))
    this.app.use(session({
      secret: SECRET,
      saveUninitialized: true,
      resave: true
    }))
    this.app.use(flash())
    this.app.use(passport.initialize())
    this.app.use(passport.session())
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*')
      // res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.header('Access-Control-Allow-Headers', '*')
      res.header('Access-Control-Allow-Headers', 'X-File-Id, X-File-Size, Origin, X-Requested-With, Authorization, Content-Type, Accept')
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        return res.sendStatus(HttpStatus.OK)
      }
      next()
    })
    this.mountRoutes()
    this.connectDatabase()
  }
}
export default App
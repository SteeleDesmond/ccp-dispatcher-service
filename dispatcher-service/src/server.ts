import * as express from 'express';
import { Server } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import fs = require('fs');
import http = require('http');
import https = require('https');
import path = require('path');
import cors = require('cors');
import { AddressInfo } from 'net';

import { parseCsvString } from './util/string-util';
import * as npmPackage from '../package.json';
import { LoggerApi } from './logger';
import { ServerConfig } from './config/server.config';

var RedisSMQ = require('rsmq');
var mongoose = require('mongoose');

const config = ServerConfig;
// const config = npmPackage.config;
const configApiContext = config['context-root'];

// ----- Connect to MongoDB
// ('mongodb://username:password@host:port/database')
if (process.env.MONGOHOST) {
  const connectString = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASS}@${process.env.MONGOHOST}:${process.env.MONGOPORT}/${process.env.MONGONAME}?authMechanism=SCRAM-SHA-1&authSource=${process.env.MONGONAME}`;
  mongoose.connect(connectString, { useNewUrlParser: true });
}
else {
  mongoose.connect(config.mongoHost, { useNewUrlParser: true });
}
mongoose.connection.on('connected', function () {
  console.log("Mongoose Connection:", config.mongoHost || 'mongodb://localhost');
});
mongoose.connection.on('error', function (err) {
  console.log("Mongoose connection has occured " + err + " error");
});
mongoose.connection.on('disconnected', function () {
  console.log("Mongoose connection is disconnected");
});
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log("Disconnecting Mongoose connection due to application termination");
    process.exit(0)
  });
});
// -----


/**
 * Connect to RedisSMQ, created in start.ts
 */
export class RedisServer {
  rsmq: any;
  constructor() {
    this.rsmq = new RedisSMQ({
      host: config.redisHost,
      port: + config.redisPort,
      password: config.redisPass,
      ns: "rsmq",
      realtime: true
    });
    console.log(`Redis Connection: ${config.redisHost}:${config.redisPort}`);
  }

  public getRsmq(): any {
    return this.rsmq;
  }
}




export class ApiServer {
  @Inject
  logger: LoggerApi;

  // private readonly app: express.Application = express();
  private server: http.Server = null;
  private httpsServer: any = null;
  // private httpServer: any = null;
  public PORT: number = + config.port;

  constructor(private readonly app: express.Application = express(), apiContext = configApiContext) {

    this.logger.apply(this.app);
    // TODO Discuss if we need cors for some GET requests
    // this.app.use(cors());

    process.on("uncaughtException", e => {
      this.logger.log(e);
      process.exit(1);
    });
    process.on("unhandledRejection", e => {
      this.logger.log(e);
      process.exit(1);
    });

    if (!apiContext || apiContext === '/') {
      this.app.use(express.static(path.join(process.cwd(), 'public'), { maxAge: 31557600000 }));
    } else {
      this.app.use(apiContext, express.static(path.join(process.cwd(), 'public'), { maxAge: 31557600000 }));
    }

    const apiRouter: express.Router = express.Router();
    Server.loadServices(
      apiRouter,
      [
        'controllers/*',
      ],
      __dirname,
    );

    const swaggerPath = path.join(process.cwd(), 'dist/swagger.json');
    if (fs.existsSync(swaggerPath)) {
      Server.swagger(
        apiRouter,
        {
          filePath: swaggerPath,
          schemes: this.swaggerProtocols,
          host: this.swaggerHost,
          endpoint: '/api-docs'
        },
      );
    }

    if (!apiContext || apiContext === '/') {
      this.app.use(apiRouter);
    } else {
      this.app.use(apiContext, apiRouter);
    }
  }


  /**
   * Start the server
   * @returns {Promise<any>}
   */
  public async start(): Promise<ApiServer> {
    return new Promise<ApiServer>((resolve, reject) => {
      // this.server = this.app.listen(this.PORT, (err: any) => {
      //   if (err) {
      //     return reject(err);
      //   }
      // });
      

      this.httpsServer = https.createServer({
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem')
      }, this.app).listen(this.PORT);

      const addressInfo = this.httpsServer.address() as AddressInfo;
      // const addressInfo = this.server.address() as AddressInfo;
      const address = addressInfo.address === '::' ? 'localhost' : addressInfo.address;

      // const httpApp = express();
      // httpApp.all('*', (req, res) => res.redirect(300,`https://${address}`));

      // this.httpServer = http.createServer(httpApp);
      // this.httpServer.listen(80, () => console.log(`HTTP server listening`));

      // // tslint:disable-next-line:no-console
      console.log(`API Server: https://${address}:${addressInfo.port}`);
      return resolve(this);
    });
  }


  /**
   * Stop the server (if running).
   * @returns {Promise<boolean>}
   */
  public async stop(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.server) {
        this.server.close(() => {
          return resolve(true);
        });
      } else {
        return resolve(false);
      }
    });
    //   if (this.httpsServer) {
    //     this.httpsServer.close(() => {
    //       return resolve(true);
    //     });
    //   } else {
    //     return resolve(false);
    //   }
    // });
  }


  public getApp(): express.Application {
    return this.app;
  }


  get swaggerProtocols(): string[] {
    return parseCsvString(process.env.PROTOCOLS, '');
  }


  get swaggerHost(): string {
    return process.env.INGRESS_HOST || '';
  }
}


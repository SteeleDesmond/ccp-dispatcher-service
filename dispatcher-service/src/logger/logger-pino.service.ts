import * as pino from 'pino';
import * as expressPino from 'express-pino-logger';
import { LoggerApi } from './logger.api';
import {ServerConfig} from '../config/server.config';
import { Task } from '../models/ticket';


var noir = require('pino-noir');
var redaction = noir(['password', 'data.password', 'data.vSphere.password', 'message.password', 'message.data.password', 'message.data.vSphere.password',
  'messageSent.password', 'messageSent.data.password', 'messageSent.data.vSphere.password', 'messageSent.data.user.password'], '*****');


// tslint:disable
class ChildLogger extends LoggerApi {

  private static _children: { 
    [name: string]: LoggerApi 
  } = {};

  private static childrenMap: Map<string, pino.Logger> = new Map();
  private static levelLabel = process.env.LOG_LEVEL || 'info';

  constructor(private logger: pino.Logger, name) {
    super();
    logger.level = ChildLogger.levelLabel;
    ChildLogger.childrenMap.set(name, logger);
  }

  setLogLevel(levelLabel: string): void {
    // console.log(`Logging level change request received: ${levelLabel}`);
    ChildLogger.levelLabel = levelLabel;
    ChildLogger.childrenMap.forEach((childLogger, loggerName) => {
      console.log(`Log level changed from ${childLogger.level} to ${levelLabel} for component ${loggerName}`);
      childLogger.level = levelLabel;
    });
  }

  removeLogger(componentName: string): void {
    ChildLogger.childrenMap.delete(componentName);
  }


  // public async getLogLevel(): Promise<string> {
  //   try {
  //     var result = await request.get(process.env.CONFIG_SERVER || 'localhost:3020/v1/setLogLevel').then(response => {
  //       return response.body.logLevel;
  //     }).catch(err => {console.log('Error retrieving log level from config server. Using default log level: ' + err)});
  //     return result;
  //   }
  //   catch(e) {
  //     console.log(e);
  //     throw e;
  //   }
  // }


  error(message: any, ...args: any): void {
    this.logger.error(message, ...args);
  }

  log(message: any, ...args: any): void {
    this.info(message, ...args);
  }

  debug(message: any, ...args: any): void {
    this.logger.debug(message, ...args);
  }

  info(message: any, ...args: any): void {
    this.logger.info(message, ...args);
  }

  warn(message: any, ...args: any): void {
    this.logger.warn(message, ...args);
  }

  fatal(message: any, ...args: any): void {
    this.logger.fatal(message, ...args);
  }

  trace(message: any, ...args: any): void {
    this.logger.trace(message, ...args);
  }

  child(component: string, transactionId?: string, clusterName?: string, task?: Task): LoggerApi {
    if (ChildLogger._children[component]) {
      return ChildLogger._children[component];
    }
    // return new ChildLogger(this.logger.child(Object.assign({component})));
    var env: string = ServerConfig.environment;
    var serviceName: string = ServerConfig.serviceName;
    return ChildLogger._children[component] = new ChildLogger(this.logger.child({env, serviceName, component, transactionId, clusterName, task}), component);
  }

  apply(app): void {
    app.use(expressPino({
      serializers: redaction
    }));
  }
}

export class PinoLoggerService extends ChildLogger {
  
  // childLoggers[];
  constructor() {
    super(PinoLoggerService.buildLogger(), 'PinoLoggerService');
  }

  static buildLogger() {
    var logLevel = process.env.LOG_LEVEL || 'info'; // Defaults

    console.log('Log level: ' + logLevel);
    var logger = pino({
      serializers: redaction,
      level: logLevel
    });
    // logger.on('level-change', this.listener);
    return logger;
  }

  // private static listener(levelLabel, levelValue, prevLevelLabel, prevLevelValue) {
  //   console.log(`Log level changed from ${prevLevelValue}:${prevLevelLabel} to ${levelValue}:${levelLabel}`);
  // }
}

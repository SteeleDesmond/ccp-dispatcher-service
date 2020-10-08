import { Container, Inject, Singleton } from 'typescript-ioc';
import Timeout = NodeJS.Timeout;

import { WorkerApi } from './worker.api';
import { environmentManager } from './environment-manager';
import { LoggerApi } from '../logger';
import { Observable, of, Subject } from 'rxjs';
import { RedisServer } from 'src/server';
import Ajv = require('ajv');
import { OutgoingResponseSchema } from '../models/schemas/outgoing/deployment.generic-outgoing-response.schema';
import { EnvironmentWorkerConfig } from '../config/environment-worker.config';
import { ResponseWorkerConfig } from '../config/response-worker.config';
var RSMQWorker = require('rsmq-worker');
var RedisSMQ = require('rsmq');

// var responseSchema = require('../models/schemas/deployment.generic-outgoing-response.schema.json');


/**
 * This Worker implements RSMQWorker to listen on the 'install-agent' queue on behalf of other workers
 * Messages are given to OpenShiftWorkerManager to be delivered to the worker
 */
export class ResponseWorker implements WorkerApi {

  @Inject private config: ResponseWorkerConfig;
  @Inject private _logger: LoggerApi;

  private id: string;
  private running = false;
  private rsmq: any;
  private rsmqWorker: any;
  private observer: Observable<any>;
  ajv = new Ajv();
  responseValidator = this.ajv.compile(new OutgoingResponseSchema().getSchema());

  constructor() {
    this.id = "Changethis"; // May want to change this
  }

  
  getLoggerName(): string {
    throw new Error("Method not implemented.");
  }

  // TODO This class isn't really a worker anymore -- could redesign to not deal with workerManager
  setDeploymentStatus(deploymentStatus: string): void {
    throw new Error("Method not implemented.");
  }
  getTask(): string {
    throw new Error("Method not implemented.");
  }

  public type(): string {
    return "install-agent"
  }


  /**
   * Listens on install-agent queue to filter & direct messages to manager
   * Note: Observable is not being used at this time
   * @param rsmq database where the install-agent queue exists, see docs for queue names
   */
  public start(redis: any): Observable<any> {
    if (this.running) { return this.observer };
    this.logger.trace("Starting Response Worker");
    if (this.observer) { // If it's started already
      return this.observer;
    }
    this.running = true;
    // this.rsmq = redis;

    this.observer = Observable.create();

    // TODO Figure out why for whatever reason, this has to be defined here rather than passed in for it to work properly
    this.rsmq = new RedisSMQ({
      host: process.env.REDISHOST || this.config.redisHost,
      port: + process.env.REDISPORT || this.config.redisPort,
      password: process.env.REDISPASS || this.config.redisPass,
      ns: "rsmq",
      realtime: true
    });

    this.rsmqWorker = new RSMQWorker(this.config.responseQueue, {
      interval: [.1, 1], // Check for new messages immediately and then every 1 second
      invisibletime: 10, // It should never take more than 5 seconds to complete
      timeout: 3000, // Must finish with the action within 3 seconds or it fails
      autostart: true, // Start the worker immediately
      alwaysLogErrors: true,
      rsmq: this.rsmq // Use the previousely defined rsmq connection
    });

    // console.log(`rsmqWorker: ${this.rsmqWorker.toString()}`);
    const self = this;
    this.rsmqWorker.on("message", function (msg, next, id) {
      try {
        // self.logger.debug(`Message Received: ${msg}`);
        var message = JSON.parse(msg);
      }
      catch {
        console.log("Error parsing JSON from message received in install-agent-worker")
      }
      finally {
        if (self.handleMessage(message)) {
          environmentManager.handleMessage(message);
        }
        next();
      }
    });
    this.rsmqWorker.on('error', function (err: any, msg: any) {
      console.log("ERROR", err, msg);
    });
    this.rsmqWorker.on('exceeded', function (msg: { id: any; }) {
      console.log("EXCEEDED", msg.id);
    });
    this.rsmqWorker.on('timeout', function (msg: { id: any; rc: any; }) {
      console.log("TIMEOUT", msg.id, msg.rc);
    });
    return this.observer;
  }


  public stop(): Observable<any> {
    this.running = false;
    this.logger.log('*** Stopping Install Agent worker');
    if (this.observer) {
      // this.observer.complete();
    }

    return this.observer || of();
  }


  public isRunning(): boolean {
    return this.running;
  }


  public getId(): string {
    return this.id;
  }


  public getStatus(): string {
    return `listening on queue ${this.config.responseQueue}`;
  }


  public handleMessage(msg: any): boolean {
    // this.logger.trace(`Validating message received on redis queue '${this.listeningQueue}'`);
    if (!this.responseValidator(msg)) {
      var error = this.ajv.errorsText(this.responseValidator.errors);
      this.logger.log(`Invalid JSON request received on ${this.config.responseQueue} redis queue with error: ${error}`);
      this.logger.debug(`Message received: ${JSON.stringify(msg)}`);
      return false;
    }
    this.logger.trace(`Valid message received from '${msg.service}'`);
    return true;
  }


  get logger(): LoggerApi {
    return this._logger.child('Install Agent Worker');
  }
}

export const responseWorker: WorkerApi = environmentManager.registerWorker(Container.get(ResponseWorker));
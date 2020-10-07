import { Inject } from 'typescript-ioc';
import Timeout = NodeJS.Timeout;
import { WorkerApi, WorkerStatus } from './worker.api';
import { LoggerApi } from '../logger';
import { ArtifactWorkerConfig } from '../config/artifact-worker.config';
import { Observable, of, Subject } from 'rxjs';
import { ArtifactDao, ArtifactState, Artifact } from '../models/artifact';
import { TicketDao, Status, TicketObj, Task } from '../models/ticket';
// import { filterPasswords } from '../util/string-util';

export class ArtifactWorker implements WorkerApi {

  @Inject private config: ArtifactWorkerConfig;
  @Inject private _logger: LoggerApi;
  @Inject private ticketDao: TicketDao;
  @Inject private artifactDao: ArtifactDao;

  private id: any;
  private running = false;
  private interval: Timeout;
  private timeout = false;
  private rsmq: any;
  private subject: any;
  private proxies = new Map();
  private artifact: Artifact;
  private runbook: any;
  private cancelRunbook: any;
  private task: Task;
  private clusterName: string;
  private requestsReceived = new Map();
  private loggerName: string;
  private workerStatus: WorkerStatus;


  /**
   * @param deployment The starting deployment, formatted and ready for first service in runbook
   * @param runbook The sequence of steps to execute in a 2d array, each inner array containing "service" and "requestType"
   */
  constructor(artifact: Artifact, runbook: any) {
    this.logger.trace('Constructing OpenShift Worker');
    this.artifact = artifact;
    var buildData = artifact.getBuildData();
    this.runbook = runbook;
    this.task = buildData.task;
    this.id = artifact.getValue('artifactId');

    this.workerStatus = {
      startDate: buildData.ticket.startDate,
      task: this.task,
      status: buildData.ticket.status,
      stage: 0,
      totalStages: runbook.length - 1,
      service: runbook[0][0],
      request: runbook[0][1],
      lastMessageSent: {},
      lastMessageReceived: {}
    };
    this.logger.trace(`Constructed`);
  }


  public type(): string {
    return "openshift"
  }


  public getTask(): string {
    return this.task;
  }


  /**
   * Starting the worker kicks off a deployment sequence of steps
   * @param redis message queue other services are listening on. Queue names are given in config
   */
  public start(redis: any): Observable<any> {

    if (this.running) { return this.subject };
    this.running = true;
    this.rsmq = redis;
    this.subject = new Subject<any>(); // Currently not being used -- will be used to cancel after set time

    // Stop after a set time
    this.interval = setInterval(() => {
      this.logger.info(`Timing out after ${this.config.runInterval / (60 * 1000)} minutes`);
      this.timeout = true;
      this.stop();
    }, this.config.runInterval);

    //TODO Add health/liveness checks to services before this worker is started
    // Send first request
    var request = this.proxies.get(this.workerStatus.service).getRequest(this.workerStatus.request);
    this.sendMessage(request, this.workerStatus.service, this.workerStatus.request);
    this.printStage();
    this.logger.log(`Started`);
    return this.subject;
  }


  public stop(): Observable<any> {
    this.running = false;
    this.logger.info(`Stopping`);
    if (this.interval) {
      clearInterval(this.interval);
    }
    // TODO Unregister with the worker manager
    if (this.subject) {
      this.subject.complete();
    }
    return this.subject || of();
  }


  public isRunning(): boolean {
    return this.running;
  }


  public getId(): string {
    return this.id.toString();
  }


  /**
   * Responds to GET status request on install
   */
  public getStatus(): WorkerStatus {
    var status = JSON.parse(JSON.stringify(this.workerStatus));
    status.stage += 1;
    status.totalStages += 1;
    return status;
  }


  public setDeploymentStatus(status: Status): void {
    this.workerStatus.status = status;
  }


  /**
   * Set status 
   * @param service - The service this worker is waiting on
   * @param request - The last request this worker sent
   * @param deploymentStatus - In Progress, Failed, or Success
   */
  private setStatus(service, request, status?: Status): boolean {
    this.workerStatus.service = service;
    this.workerStatus.request = request;
    if (status) {
      this.workerStatus.status = status;
    }
    this.runbook.forEach((stage, index) => {
      // Note: This does not account for runbooks that make the same request twice
      if (stage[0] === service && stage[1] === request) {
        this.workerStatus.stage = index;
      }
    });
    return true;
  }


  /**
   * Handle an incoming message
   * Routes messages to proxies to handle/generate responses/requests
   * @param msg Validated return message from redis queue for this worker's install
   */
  public handleMessage(msg: any): void {
    if (!this.isRunning()) { return };
  }


  /**
   * Send a Message to a Redis queue
   * @param msg Message to send
   * @param queue Queue to push the message on to
   */
  private sendMessage(message: any, queue: string, requestType: string): void {
    this.workerStatus.lastMessageSent = message;
    message.service = this.config.requestQueue; // This is the response queue sent in the message
    message.requestType = requestType; // Request type assigned by helper
    message = JSON.stringify(message);
    this.rsmq.sendMessage({ qname: queue, message: message }, (err, resp) => {
      if (err) {
        console.error(err);
        console.log("queue: " + queue.toString());
        console.log("requestType: " + requestType.toString());
        return;
      }
      this.logger.trace(`\nRequest '${requestType.toString()}' sent to ${queue}`);

      var log = {
        messageSent: JSON.parse(message)
      }
      this.logger.debug(log);
      // this.logger.debug(`Message Sent: ${log}\n`);
      // this.logger.debug(`\nCurrent Deployment: ${JSON.stringify(this.deployment.getData())}\n`);
    });
  }


  private printStage(): void {
    this.logger.printStage(this.workerStatus.stage + 1, this.runbook.length, this.workerStatus.service, this.workerStatus.request);
  }


  public getLoggerName(): string {
    return this.loggerName;
  }


  get logger(): LoggerApi {
    this.loggerName = 'OpenShift Worker ' + this.id;
    return this._logger.child(this.loggerName, this.id, this.clusterName, this.task);
  }
}
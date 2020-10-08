import { WorkerApi } from './worker.api';
import { Container, ContainerConfiguration, Inject, Scope } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { forkJoin, Observable } from 'rxjs';
import { WorkerManager } from './worker-manager.api';
import { EnvironmentWorker } from './environment.worker';
import Timeout = NodeJS.Timeout;
import { EnvironmentWorkerConfig } from '../config/environment-worker.config';
// import { InstallAgentWorkerConfig } from '../config/install-agent-worker.config';



class EnvironmentManager implements WorkerManager {
  @Inject workerConfig: EnvironmentWorkerConfig;
  @Inject _logger: LoggerApi;
  private redis: any;
  private interval: Timeout;
  private workers: WorkerApi[] = []; // Response Worker and Artifact Worker
  private activeWorkers: WorkerApi[] = [];
  private queuedWorkers: WorkerApi[] = [];


  /**
   * Registering a worker gives it the redis instance and starts it
   * The worker's starting info should be verified externally as it is not verified by the manager
   * @param worker An OpenShift worker which has its startingData
   */
  public registerWorker(worker: WorkerApi): WorkerApi {
    this.logger.trace("Registered new Environmentworker");
    if (worker) { // TODO May want to implement checks before starting the worker
      if (worker.type() == "environmentWorker") {
        if (this.getWorker(worker.getId())) { // If a worker with this ID exists queue the worker
          this.logger.info(`There is currently an active job for ${worker.getId()}. Task ${worker.getTask()} will start once the existing job completes or times out`);
          this.queuedWorkers.push(worker);
          worker.setDeploymentStatus('Pending'); // TODO Update queued worker status' and/or provide REST endpoint to all active/queued workers
          this.logger.trace("Queued New EnvironmentWorker");
        }
        else {
          this.activeWorkers.push(worker);
          worker.start(this.redis);
          this.logger.trace("Started New EnvironmentWorker");
        }
      }
      this.workers.push(worker);
    }
    return worker;
  }


  /**
   * 1. Save an instance of Redis
   * 2. Start any workers pre-registered (install-agent.worker)
   * @param rsmq Redis instance to be used by the workers
   */
  public async start(rsmq: any): Promise<any> {
    this.redis = rsmq;
    this.logger.trace('Starting Worker Manager');
    const queues = [
      this.workerConfig.requestQueue
    ];
    for (var q of queues) {
      this.createRedisQueue(q, this.redis);
    }
    const observables: Observable<any>[] = this.workers.map(worker => worker.start(rsmq));

    // On a set schedule, remove old workers and allow new jobs to start (for multiple jobs queued on a single deployment)
    this.interval = setInterval(() => {
      this.update();
    }, this.workerConfig.runInterval);

    return forkJoin(observables).toPromise().then(result => 'Done');
  }


  public async stop(): Promise<any> {
    // TODO Graceful stop on workers --> Save state if necessary, cancel installs
    this.logger.log('Stopping workers');
    if (this.interval) {
      clearInterval(this.interval);
    }
    const observables: Observable<any>[] = this.workers.map(worker => worker.stop());
    // TODO Close redis connections
    return forkJoin(observables).toPromise().then(result => 'stopped');
  }


  public workerCount(): number {
    return this.workers.length;
  }


  // There could be a race condition issue - Case where this updates at the same time a request/message comes in?
  public update(): void {
    this.logger.trace(`Cleaning`); // TODO move to trace
    // Clear stopped workers
    var that = this;
    if(this.activeWorkers.length > 0) {
      this.activeWorkers.forEach(function (w, index) {
        that.logger.debug(`Active worker: ${w.getId()} with task ${w.getTask()}`); // move to TODO debug
        if(!w.isRunning()) {
          that.logger.info(`Removing finished worker ${w.getId()} performing task ${w.getTask()}`);
          that.activeWorkers.splice(index, 1);
          that.logger.removeLogger(w.getLoggerName());
          that.logger.trace(`Deleted OpenShift Worker Logger ${w.getLoggerName()}`);
        }
      });
    }
    // Start any queued workers that are now free
    if(this.queuedWorkers.length > 0) {
      this.queuedWorkers.forEach(function (w, index) {
        that.logger.debug(`Queued worker: ${w.getId()} with task ${w.getTask()}`); // TODO move to debug
        // If we cannot find a worker with matching id in the active queue
        if(!that.activeWorkers.find(worker => worker.getId() == w.getId())) {
          // Move the worker from queued to active
          that.logger.info(`Starting worker ${w.getId()} performing task ${w.getTask()}`);
          that.queuedWorkers.splice(index, 1);
          that.activeWorkers.push(w);
          w.start(that.redis);
        }
      });
    }
  }


  public getWorkerStatus(transactionId: string): object {
    var status;
    try {
      status = this.getWorker(transactionId).getStatus();
    }
    catch { // TODO Add status check for queued workers
      // this.logger.info(`Status request is not an active installation`)
    }
    return status;
  }


  /**
   * Process and deliver incoming message to appropriate worker
   * @param msg JSON message from install-agent queue
   */
  public handleMessage(msg: any): void {
    this.logger.trace(`New Message ${msg.transactionId} from ${msg.service}`);
    var worker = this.getWorker(msg.transactionId);
    if (worker) {
      worker.handleMessage(msg);
    }
  }


  /**
   * Get an openshift worker by id
   * @param transactionId 
   */
  private getWorker(transactionId: string): EnvironmentWorker {
    var worker;
    // for(var w of this.openShiftWorkers) { // For debugging
    //   console.log(`Worker ID: ${w.getId()}`);
    // }
    if (this.activeWorkers.length > 0) {
      worker = this.activeWorkers.find(id => id.getId() === transactionId);
      if (worker) {
        return worker;
      }
    }
    // this.logger.warn(`${transactionId} does not match an active deployment`);
    return null;
  }

  // TODO Finish implementing for REST call
  // private getWorkers(): any {
  //   return JSON.parse(`Active Workers: ${this.openShiftWorkers.forEach(w => {w.getId()})}\nQueued Workers: ${this.queuedWorkers.forEach(w => {w.getId()})}`);
  // }


  private createRedisQueue(queueName: string, redis: any) {
    // List the queues
    var that = this;
    // console.log(`Entering redis.listQueues with queueName: ${queueName}`);
    redis.listQueues(function (err, queues) {
      // console.log('Entering redis.listQueues in openshiftWorkerManager');
      if (err) {
        console.error(err)
        return
      }
      // console.log(queues);
      // Create the queue if it doesn't exist
      if (!queues.includes(queueName)) {
        // console.log(`Creating ${queueName} queue in Redis DB`);

        redis.createQueue({ qname: queueName }, function (err, resp) {
          if (err) {
            console.error(err)
            return;
          }

          if (resp === 1) {
            that.logger.debug(`${queueName} queue created in Redis DB`);
          }
        });
      } else {
        that.logger.debug(`${queueName} queue detected in Redis DB`);
      }
    });
  }


  get logger(): LoggerApi {
    return this._logger.child('EnvironmentManager');
  }
}


export const config: ContainerConfiguration[] = [
  {
    bind: WorkerManager,
    to: EnvironmentManager,
    scope: Scope.Singleton
  }
];

export const environmentManager: WorkerManager = Container.get(EnvironmentManager);
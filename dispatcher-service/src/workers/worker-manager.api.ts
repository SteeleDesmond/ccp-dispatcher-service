import {WorkerApi} from './worker.api';
import { RedisServer } from 'src/server';

export abstract class WorkerManager {
    abstract registerWorker(worker: WorkerApi): WorkerApi;
    abstract start(redis: any): Promise<any>;
    abstract stop(): Promise<any>;
    abstract workerCount(): number;
    abstract getWorkerStatus(id): any;
    abstract handleMessage(msg: any): void;
  }
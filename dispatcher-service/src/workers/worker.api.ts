
import {Observable} from 'rxjs';
import { Task } from '../models/environment';

// tslint:disable:no-any
export abstract class WorkerApi {
  abstract type(): string; // type of worker "install-agent" or "openshift"
  abstract start(rsmq: any, task?: any): Observable<any>;
  abstract stop(): Observable<any>;
  abstract isRunning(): boolean
  abstract getId(): string; // uuid\
  abstract getStatus(): any; // current status of install
  abstract setDeploymentStatus(deploymentStatus: string): void;
  abstract getTask(): string;
  abstract handleMessage(msg: any): void;
  abstract getLoggerName(): string;
}

// // private status: any = {
// //   deploymentStage: 0, // index we are at in the runbook
// //   deploymentStatus: "String", // Failed, Success, In Progress
// //   currentService: "String", // Service a message was last sent to
// //   currentRequest: "String", // Request sent to the service
// //   lastMessageSent: {},
// //   lastMessageReceived: {}
// // };

// export interface TicketObj {
//   _id?: any, // Attached to document after save
//   __v?: any,
//   transactionId: String,
//   username: String,
//   clusterName: String,
//   location: String,
//   task: Task,
//   numNodes?: Number,
//   status: TicketStatus,
//   startTime: Number,
//   endTime?: Number,
//   totalTime: Number,
//   message?: String,
//   totalRequestTime: WorkerStatus,
//   
// }

export interface WorkerStatus {
  startDate: String,
  task: Task,
  status: Status,
  stage: number,
  totalStages: number,
  service: string,
  request: string,
  lastMessageSent?: {},
  lastMessageReceived?: {},
  message?: string,
  requestTimes?: {},
}

export enum Status {
  PROVISIONING = "Provisioning",
  UPDATING = "Updating",
  DELETING = "Deleting",
  SUCCESS = "Success",
  FAILED = "Failed",
  ERROR = "Error"
}


// export interface RequestType {
//   redis: {
//     queue: 
//   }
// }


// export interface WorkerStatus {
//   stage: Stage,
//   task: Task,
//   runbook: Runbook,
// }


// export interface Stage {
//   service: string,
//   request: string,
//   method: 
// }
// export interface Runbook {

// }


// export enum TicketStatus {
//   PROVISIONING = "Provisioning",
//   UPDATING = "Updating",
//   DELETING = "Deleting",
//   SUCCESS = "Success",
//   FAILED = "Failed",
//   ERROR = "Error",
//   STAGE_1 = ""
// }


// export enum Task {
//   CREATE_CLUSTER = 'createCluster',
//   ADD_NODES = 'addNodes',
//   DELETE_NODES = 'deleteNodes',
//   DELETE_CLUSTER = 'deleteCluster'
// }




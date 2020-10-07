import { Task } from '../models/ticket';

// tslint:disable
export abstract class LoggerApi {
  abstract setLogLevel(levelLabel: string): void;
  abstract removeLogger(componentName: string): void
  abstract log(message: any, ...args: any): void;
  abstract info(message: any, ...args: any): void;
  abstract debug(message: any, ...args: any): void;
  abstract fatal(message: any, ...args: any): void;
  abstract warn(message: any, ...args: any): void;
  abstract error(message: any, ...args: any): void;
  abstract trace(message: any, ...args: any): void;
  abstract child(name: string, transactionId?: string, clusterName?: string, task?: Task): LoggerApi;
  abstract apply(app: {use: (app: any) => void}): void;
  time(action: string, startTime: number): void {
    var time = (Date.now() - startTime) / 1000;
    var unit = 'seconds';
    if(time > 300) { // If longer than 5 minutes
      unit = 'minutes';
      time = time / 1000;
    }
    this.info(
      {
        type: 'Timer',
        action: action,
        duration: time,
        unit: unit,
      },
      `${action} completed in ${time} ${unit}`,
    );
  }

  printStage(stage: number, numStages: number, service: string, request: string): void {
    this.info(
      {
        stage: stage,
        totalStages: numStages,
        service: service,
        request: request
      },
      `Stage ${stage}/${numStages} - Sent request ${request} to service ${service}`
    );
  }
}

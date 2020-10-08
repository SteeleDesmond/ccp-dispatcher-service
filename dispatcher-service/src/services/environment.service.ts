import { EnvironmentApi } from './environment.api';
import { Inject } from 'typescript-ioc';
import { v4 as uuidv4 } from 'uuid';
import { LoggerApi } from '../logger';
import { environmentManager, EnvironmentWorker } from '../workers';
import { Environment, EnvironmentModel, EnvironmentDao, EnvironmentState, Task } from '../models/environment';
// import { TicketModel, Ticket, TicketDao, TicketObj, Status } from '../models/ticket';
import { EnvironmentServiceConfig } from '../config/environment-service.config';
import { EnvironmentWorkerConfig } from '../config/environment-worker.config';
import { ServerConfig } from '../config/server.config';
import request = require('superagent');
import { TicketObj } from 'src/models/ticket';


export class EnvironmentService implements EnvironmentApi {

  @Inject private config: EnvironmentServiceConfig;
  @Inject private environmentWorkerConfig: EnvironmentWorkerConfig;
  @Inject private environmentDao: EnvironmentDao;
  // @Inject private ticketDao: TicketDao;
  logger: LoggerApi;


  constructor(@Inject logger: LoggerApi) {
    this.logger = logger.child('OpenShiftService');
  }
  requestEnvironment(token: String, data: any): Promise<TicketObj> {
    throw new Error('Method not implemented.');
  }
  modifyEnvironment(token: String, data: any): Promise<object> {
    throw new Error('Method not implemented.');
  }
  deleteEnvironment(token: String, data: any): Promise<TicketObj> {
    throw new Error('Method not implemented.');
  }
  getEnvironmentStatus(token: string, environmentId: any): Promise<object> {
    throw new Error('Method not implemented.');
  }
  getEnvironment(token: string, environmentId: string): Promise<object> {
    throw new Error('Method not implemented.');
  }
  
  
  getEnvironmentsAndTicketsByUserToken(token: string): Promise<object> {
    throw new Error('Method not implemented.');
  }
  getAllEnvironments(): Promise<object> {
    throw new Error('Method not implemented.');
  }
  listAllEnvironments(status?: string): Promise<object> {
    throw new Error('Method not implemented.');
  }
  listAllEnvironmentsByUserToken(token: string): Promise<object> {
    throw new Error('Method not implemented.');
  }


  private async getUsernameFromToken(token: string): Promise<string> {
    return await request.get(this.config.authzAgentUrl + `/api/v1/auth/userinfo`).auth(token.split(' ')[1], {type: 'bearer'})
    .then(response => {
      return response.body.username;
    });
  }
}
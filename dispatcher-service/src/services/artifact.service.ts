import { ArtifactApi } from './artifact.api';
import { Inject } from 'typescript-ioc';
import { v4 as uuidv4 } from 'uuid';
import { LoggerApi } from '../logger';
import { artifactManager, ArtifactWorker } from '../workers';
import { Artifact, ArtifactModel, ArtifactDao, ArtifactState } from '../models/artifact';
import { TicketModel, Ticket, TicketDao, TicketObj, Status, Task } from '../models/ticket';
import { ArtifactServiceConfig } from '../config/artifact-service.config';
import { ArtifactWorkerConfig } from '../config/artifact-worker.config';
import { ServerConfig } from '../config/server.config';
import request = require('superagent');


// TODO Deprecate 'Running' deployment status after > 30 days
export class ArtifactService implements ArtifactApi {

  @Inject private config: ArtifactServiceConfig;
  @Inject private artifactWorkerConfig: ArtifactWorkerConfig;
  @Inject private artifactDao: ArtifactDao;
  @Inject private ticketDao: TicketDao;
  logger: LoggerApi;


  constructor(@Inject logger: LoggerApi) {
    this.logger = logger.child('OpenShiftService');
  }

  requestArtifact(token: String, data: any): Promise<TicketObj> {
    throw new Error('Method not implemented.');
  }
  modifyArtifact(token: String, data: any): Promise<object> {
    throw new Error('Method not implemented.');
  }
  deleteArtifact(token: String, data: any): Promise<TicketObj> {
    throw new Error('Method not implemented.');
  }
  getArtifactStatus(token: string, artifactId: string): Promise<object> {
    throw new Error('Method not implemented.');
  }
  getArtifact(token: string, artifactId: string): Promise<object> {
    throw new Error('Method not implemented.');
  }

  getArtifactsAndTicketsByUserToken(token: string): Promise<object> {
    throw new Error('Method not implemented.');
  }
  getAllArtifacts(): Promise<object> {
    throw new Error('Method not implemented.');
  }
  listAllArtifacts(status?: string): Promise<object> {
    throw new Error('Method not implemented.');
  }
  listAllArtifactsByUserToken(token: string): Promise<object> {
    throw new Error('Method not implemented.');
  }


  private async getUsernameFromToken(token: string): Promise<string> {
    return await request.get(this.config.authzAgentUrl + `/api/v1/auth/userinfo`).auth(token.split(' ')[1], {type: 'bearer'})
    .then(response => {
      return response.body.username;
    });
  }
}
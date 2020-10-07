import { Errors, GET, Path, PathParam, POST, DELETE, PUT, HeaderParam } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { ArtifactApi } from '../services';
import { LoggerApi } from '../logger';
import Ajv = require('ajv');
import { CreateArtifactRequestSchema } from '../models/schemas/incoming/create-artifact.request.schema';
import { ModifyArtifactRequestSchema } from '../models/schemas/incoming/modify-artifact.request.schema';
import { DeleteArtifactRequestSchema } from '../models/schemas/incoming/delete-artifact.request.schema';
import { TicketObj, Status } from '../models/ticket';

@Path('/v1')
export class ArtifactController {

  @Inject artifactService: ArtifactApi;
  @Inject _baseLogger: LoggerApi;
  ajv = new Ajv();
  createRequest = this.ajv.compile(new CreateArtifactRequestSchema().getSchema());
  modifyRequest = this.ajv.compile(new ModifyArtifactRequestSchema().getSchema());
  deleteRequest = this.ajv.compile(new DeleteArtifactRequestSchema().getSchema());


  @Path('artifact')
  @POST
  async createArtifact(@HeaderParam('authorization') token: string, data: object): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    if (!this.createRequest(data)) {
      throw new Errors.BadRequestError(`${this.ajv.errorsText(this.createRequest.errors)}`);
    }
    var result = await this.artifactService.requestArtifact(token, data);
    if(result.status == Status.ERROR) {
      throw new Errors.InternalServerError(`${result.message}`);
    }
    return result;
  }

  @Path('artifact')
  @PUT
  async modifyArtifact(@HeaderParam('authorization') token: string, data: object): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    if (!this.modifyRequest(data)) {
      throw new Errors.BadRequestError(`${this.ajv.errorsText(this.modifyRequest.errors)}`);
    }
    var result = await this.artifactService.modifyArtifact(token, data);
    return result;
  }

  @Path('artifact')
  @DELETE
  async deleteArtifact(@HeaderParam('authorization') token: string, data: object): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    if (!this.deleteRequest(data)) {
      throw new Errors.BadRequestError(`${this.ajv.errorsText(this.deleteRequest.errors)}`);
    }
    var result = await this.artifactService.deleteArtifact(token, data);
    if(result.status == Status.ERROR) {
      throw new Errors.InternalServerError(`${result.message}`);
    }
    return result;
  }


  @Path('artifact/status/:artifactId')
  @GET
  async getArtifactStatus(@HeaderParam('authorization') token: string, artifactId: string): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    var result = await this.artifactService.getArtifactStatus(token, artifactId);
    return result;
  }


  @Path('artifact/:artifactId')
  @GET
  async getArtifact(@HeaderParam('authorization') token: string, artifactId: string): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    var result = await this.artifactService.getArtifact(token, artifactId);
    return result;
  }


  get logger() {
    return this._baseLogger.child('ArtifactController');
  }
}
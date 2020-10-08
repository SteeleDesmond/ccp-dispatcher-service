import { Errors, GET, Path, PathParam, POST, DELETE, PUT, HeaderParam } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { EnvironmentApi } from '../services';
import { LoggerApi } from '../logger';
import Ajv = require('ajv');
import { CreateEnvironmentRequestSchema } from '../models/schemas/incoming/create-environment.request.schema';
import { ModifyEnvironmentRequestSchema } from '../models/schemas/incoming/modify-environment.request.schema';
import { DeleteEnvironmentRequestSchema } from '../models/schemas/incoming/delete-environment.request.schema';
// import { TicketObj } from '../models/ticket';
import { Status } from '../workers/worker.api';

@Path('/v1')
export class EnvironmentController {

  @Inject environmentService: EnvironmentApi;
  @Inject _baseLogger: LoggerApi;
  ajv = new Ajv();
  createRequest = this.ajv.compile(new CreateEnvironmentRequestSchema().getSchema());
  modifyRequest = this.ajv.compile(new ModifyEnvironmentRequestSchema().getSchema());
  deleteRequest = this.ajv.compile(new DeleteEnvironmentRequestSchema().getSchema());


  @Path('environment')
  @POST
  async creatEnvironment(@HeaderParam('authorization') token: string, data: object): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    if (!this.createRequest(data)) {
      throw new Errors.BadRequestError(`${this.ajv.errorsText(this.createRequest.errors)}`);
    }
    var result = await this.environmentService.requestEnvironment(token, data);
    if(result.status == Status.ERROR) {
      throw new Errors.InternalServerError(`${result.message}`);
    }
    return result;
  }

  @Path('environment')
  @PUT
  async modifyEnvironment(@HeaderParam('authorization') token: string, data: object): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    if (!this.modifyRequest(data)) {
      throw new Errors.BadRequestError(`${this.ajv.errorsText(this.modifyRequest.errors)}`);
    }
    var result = await this.environmentService.modifyEnvironment(token, data);
    return result;
  }

  @Path('environment')
  @DELETE
  async deleteEnvironment(@HeaderParam('authorization') token: string, data: object): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    if (!this.deleteRequest(data)) {
      throw new Errors.BadRequestError(`${this.ajv.errorsText(this.deleteRequest.errors)}`);
    }
    var result = await this.environmentService.deleteEnvironment(token, data);
    if(result.status == Status.ERROR) {
      throw new Errors.InternalServerError(`${result.message}`);
    }
    return result;
  }


  @Path('environment/status/:environmentId')
  @GET
  async getEnvironmentStatus(@HeaderParam('authorization') token: string, environmentId: string): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    var result = await this.environmentService.getEnvironmentStatus(token, environmentId);
    return result;
  }


  @Path('environment/:environmentId')
  @GET
  async getEnvironment(@HeaderParam('authorization') token: string, environmentId: string): Promise<object> {
    if(!token) { 
      throw new Errors.BadRequestError(`Authorization token not found`);
    }
    var result = await this.environmentService.getEnvironment(token, environmentId);
    return result;
  }


  get logger() {
    return this._baseLogger.child('environmentController');
  }
}
import {Path, PathParam, POST, GET} from 'typescript-rest';
import { LoggerApi } from '../logger';
import { Inject } from 'typescript-ioc';
import { ServerConfig } from '../config/server.config';


@Path('/config')
export class ConfigController {

  @Inject _logger: LoggerApi;

  @Path('/setLogLevel/:levelLabel')
  @POST
  async setLogLevel(@PathParam('levelLabel') levelLabel: string): Promise<{status: string;}> {
    this.logger.setLogLevel(levelLabel);
    return {
      status: 'Success'
    };
  }

  get logger(): LoggerApi {
    return this._logger.child('Config Controller');
  }
}
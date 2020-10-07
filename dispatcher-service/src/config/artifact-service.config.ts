import * as npmPackage from '../../package.json';

export class ArtifactServiceConfig {

  get apiVersion(): string {
    return process.env.API_VERSION || npmPackage.version;
  }

  get authzAgentUrl(): string { 
    return process.env.AUTHZ_AGENT_ROUTE;
  }
}
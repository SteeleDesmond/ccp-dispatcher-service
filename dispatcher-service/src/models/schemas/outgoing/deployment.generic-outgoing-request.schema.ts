import { Inject } from 'typescript-ioc';
import { ArtifactWorkerConfig } from 'src/config/artifact-worker.config';


export class OutgoingRequestSchema {

  @Inject
  private config: ArtifactWorkerConfig;

  schema: any = {
    "title": "Generic Outgoing Redis Request",
    // "type": "object",
    "required": [
      "apiVersion",
      "transactionId",
      "service",
      "requestType"
    ],
    "properties": {
      "apiVersion": {
        "type": "string",
        "pattern": "^[0-9\\.]+$",
        "minLength": 5
      },
      "transactionId": {
        "type": "string",
        "minLength": 5
      },
      "service": {
        "type": "string",
        "enum": [
          // this.config.requestQueue
        ]
      },
      "requestType": {
        "type": "string",
        "minLength": 3,
        "enum": [
          "verifyToken"
        ]
      }
    }
  };

  public getSchema(): any {
    return this.schema;
  }
}
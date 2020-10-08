import { ResponseWorkerConfig } from '../../../config/response-worker.config';
import { Inject } from 'typescript-ioc';


export class OutgoingResponseSchema {

  @Inject
  private config: ResponseWorkerConfig;

  schema: any = {
    "title": "Generic Outgoing Environment Artifact Response",
    // "type": "object",
    "required": [
      "apiVersion",
      "transactionId",
      "service",
      "requestType",
      "status",
      "statusCode"
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
          this.config.responseQueue,
        ]
      },
      "requestType": {
        "type": "string",
        "minLength": 3,
        "enum": [
          "verifyToken"
        ]
      },
      "status": {
        "type": "string",
        "enum": [
          "success",
          "failure"
        ]
      },
      "statusCode": {
        "type": "integer"
      }
    }
  };

  public getSchema(): any {
    return this.schema;
  }
}
export class CreateEnvironmentRequestSchema {

  schema: any = {
    "title": "Create Environment Request",
    "type": "object",
    "required": [
      "apiVersion",
      "data"
    ],
    "properties": {
      "apiVersion": {
        "type": "string",
        "pattern": "([1-9]\.[0-9]\d*|[0-9]\.\d\d|\.[0-9](\.\d+)?|\d\d+(\.\d+)?)", // 1.x.x +
        "minLength": 5
      },
      "transactionId": {
        "type": "string",
        "minLength": 10
      },
      "data": {
        "type": "object",
        "properties": {
          "cluster": {
            "type": "object",
            "required": [
              "name",
              "version",
              "size"
            ],
            "properties": {
              "name": {
                "type": "string",
                "pattern": "[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*",
                "minLength": 3,
                "maxLength": 16
              },
              "version": {
                "type": "string",
                "pattern": "^[0-9\\.]+$",
                "minLength": 5
              },
              "size": {
                "type": "string",
                "pattern": "x-small|small|medium|large",
                "maxLength": 7
              },
              "workerSize": {
                "type": "string",
                "pattern": "2x8|4x16|8x32|16x64|32x128|64x256"
              }
            }
          }
        }
      }
    }
  };

  public getSchema(): any {
    return this.schema;
  }
}
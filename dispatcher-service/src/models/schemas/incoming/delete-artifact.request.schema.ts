export class DeleteArtifactRequestSchema {

  schema: any = {
    "title": "Incoming Delete Deployment Request",
    "type": "object",
    "required": [
      "apiVersion",
      "data"
    ],
    "properties": {
      "apiVersion": {
        "type": "string",
        "pattern": "([2-9]\.[0-9]\d*|[0-9]\.\d\d|\.[0-9](\.\d+)?|\d\d+(\.\d+)?)", // 2.x.x +
        "minLength": 5
      },
      "data": {
        "type": "object",
        "properties": {
          "cluster": {
            "type": "object",
            "required": [
              "transactionId",
            ],
            "properties": {
              "transactionId": {
                "type": "string",
                "minLength": 10
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
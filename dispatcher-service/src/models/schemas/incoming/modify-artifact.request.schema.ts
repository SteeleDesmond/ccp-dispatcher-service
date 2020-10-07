export class ModifyArtifactRequestSchema {

  schema: any = {
    "title": "Incoming Modify Artifact Request",
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
              "action",
              "numNodes"
            ],
            "properties": {
              "transactionId": {
                "type": "string",
                "minLength": 10
              },
              "action": {
                "type": "string",
                "pattern": "(add|delete)",
                "minLength": 3,
                "maxLength": 6
              },
              "numNodes": {
                "type": "number",
                "minimum": 1,
                "maximum": 3
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
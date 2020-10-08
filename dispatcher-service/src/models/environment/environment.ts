import { LoggerApi } from '../../logger';
import { Inject } from 'typescript-ioc';
var mongoose = require('mongoose');


const environmentSchema = new mongoose.Schema({});
export const EnvironmentModel = mongoose.model('EnvironmentModel', environmentSchema);


export enum EnvironmentState {
  PROVISIONING = "Provisioning",
  READY = "Ready",
  DELETED = "Deleted",
  FAILED = "Failed",
  // UNSTABLE = "Unstable"
}

// Also used in buildData of Deployment and given to OpenShift Workers
export enum Task {
  CREATE_ENVIRONMENT = 'createEnvironment',
  MODIFY_ENVIRONMENT = 'modifyEnvironment',
  DELETE_ENVIRONMENT = 'deleteEnvironment'
}



export class Environment {

  @Inject _baseLogger: LoggerApi;

  private jsonData: any;
  private buildData: any;

  constructor(environmentData: any, buildData: any) {
    this.jsonData = environmentData;
    this.buildData = buildData;
  }


  public setValue(key: string, value: string): boolean {
    this.jsonData[key] = value;
    return true;
  }


  public getValue(pathToValue: string): any {
    return this.jsonData[pathToValue];
  }


  public getData(): any {
    return this.jsonData;
  }


  public setData(data: any): void {
    this.jsonData = data;
  }


  public getBuildData(): any {
    return this.buildData;
  }


  public setBuildData(buildData: any): any {
    this.buildData = buildData;
  }

  get logger() {
    return this._baseLogger.child('EnvironmentObject');
  }
}


export class EnvironmentDao {

  public async getAllEnvironment(): Promise<any[]> {
    return EnvironmentModel.find({});
  }


  public getEnvironmentById(transactionId: string): Promise<any> {
    return EnvironmentModel.findOne({ 'transactionId': transactionId });
  }


  public getEnvironmentsByUser(username: string): Promise<any[]> {
    return EnvironmentModel.find({ 'data.vSphere.username': username });
  }


  public getEnvironmentsByStatus(status: string): Promise<any[]> {
    return EnvironmentModel.find({ 'status': status });
  }


  public getEnvironmentByClusterName(name: string): Promise<any> {
    return EnvironmentModel.find({ 'data.cluster.name': name });
  }

  public saveEnvironment(environmentData: any): boolean {

    var environment = new EnvironmentModel(environmentData);
    environment.save().then(() => {
      console.log(`Environment ${environment.environmentId} saved to Mongo database`);
    }).catch(err => {
      console.log(`Error saving Environment: ${err}`);
      return false;
    });
    return true;
  }

  public deleteEnvironment(environment: any): void {
    throw new Error("Method not implemented.");
  }
}
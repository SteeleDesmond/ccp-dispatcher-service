import { LoggerApi } from '../../logger';
import { Inject } from 'typescript-ioc';
var mongoose = require('mongoose');


const artifactSchema = new mongoose.Schema({});
export const ArtifactModel = mongoose.model('ArtifactModel', artifactSchema);


export enum ArtifactState {
  PROVISIONING = "Provisioning",
  READY = "Ready",
  DELETED = "Deleted",
  FAILED = "Failed",
  // UNSTABLE = "Unstable"
}


export class Artifact {

  @Inject _baseLogger: LoggerApi;

  private jsonData: any;
  private buildData: any;

  constructor(deploymentData: any, buildData: any) {
    this.jsonData = deploymentData;
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
    return this._baseLogger.child('ArtifactObject');
  }
}


export class ArtifactDao {

  public async getAllArtifacts(): Promise<any[]> {
    return ArtifactModel.find({});
  }


  public getArtifactById(transactionId: string): Promise<any> {
    return ArtifactModel.findOne({ 'transactionId': transactionId });
  }


  public getArtifactsByUser(username: string): Promise<any[]> {
    return ArtifactModel.find({ 'data.vSphere.username': username });
  }


  public getArtifactsByStatus(status: string): Promise<any[]> {
    return ArtifactModel.find({ 'status': status });
  }


  public getArtifactByClusterName(name: string): Promise<any> {
    return ArtifactModel.find({ 'data.cluster.name': name });
  }

  public saveArtifact(artifactData: any): boolean {

    var artifact = new ArtifactModel(artifactData);
    artifact.save().then(() => {
      console.log(`Deployment ${artifact.transactionId} saved to Mongo database`);
    }).catch(err => {
      console.log(`Error saving Deployment: ${err}`);
      return false;
    });
    return true;
  }

  public deleteArtifact(artifact: any): void {
    throw new Error("Method not implemented.");
  }
}
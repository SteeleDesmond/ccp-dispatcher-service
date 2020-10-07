import { TicketObj } from 'src/models/ticket';

export abstract class ArtifactApi {
    abstract async requestArtifact(token: String, data: any): Promise<TicketObj>; // POST /deployments/openshift
    abstract async modifyArtifact(token: String, data: any): Promise<object>; // PUT /deployments/openshift
    abstract async deleteArtifact(token: String, data: any): Promise<TicketObj>; // DELETE /deployments/${uuid}
    abstract async getArtifactStatus(token: string, artifactId: any): Promise<object>; // GET /deployments/${uuid}
    abstract async getArtifact(token: string, artifactId: string): Promise<object>; // GET /deployments/openshift/${uuid}
    abstract async getArtifactsAndTicketsByUserToken(token: string): Promise<object>; // GET /deployments/openshift
    abstract async getAllArtifacts(): Promise<object>;
    abstract async listAllArtifacts(status?: string): Promise<object>;
    abstract async listAllArtifactsByUserToken(token: string): Promise<object>;
  }
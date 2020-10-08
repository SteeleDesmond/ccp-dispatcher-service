import { TicketObj } from 'src/models/ticket';

export abstract class EnvironmentApi {
    abstract async requestEnvironment(token: String, data: any): Promise<TicketObj>; // POST /deployments/openshift
    abstract async modifyEnvironment(token: String, data: any): Promise<object>; // PUT /deployments/openshift
    abstract async deleteEnvironment(token: String, data: any): Promise<TicketObj>; // DELETE /deployments/${uuid}
    abstract async getEnvironmentStatus(token: string, environmentId: any): Promise<object>; // GET /deployments/${uuid}
    abstract async getEnvironment(token: string, environmentId: string): Promise<object>; // GET /deployments/openshift/${uuid}
    abstract async getEnvironmentsAndTicketsByUserToken(token: string): Promise<object>; // GET /deployments/openshift
    abstract async getAllEnvironments(): Promise<object>;
    abstract async listAllEnvironments(status?: string): Promise<object>;
    abstract async listAllEnvironmentsByUserToken(token: string): Promise<object>;
  }
import { Application } from 'express';
import * as request from 'supertest';
import { Container, Scope } from 'typescript-ioc';

import { DeploymentApi } from '../../src/services';
import { buildApiServer } from '../helper';
import { v4 as uuidv4 } from 'uuid';

class MockDeploymentService implements DeploymentApi {
  requestDeployment(deploymentData: any): Promise<object> {
    throw new Error("Method not implemented.");
  }
  getDeployments(deploymentData: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
  getDeployment(id: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
  modifyDeployment(deploymentData: any): Promise<object> {
    throw new Error("Method not implemented.");
  }
  deleteDeployment(deploymentData: any): Promise<object> {
    throw new Error("Method not implemented.");
  }
  getDeploymentStatus(id: string): Promise<object> {
    throw new Error("Method not implemented.");
  }

  deploymentRequest = jest.fn().mockName('deploymentRequest');
}

describe('deployment.controller', () => {

  let app: Application;
  let mockGetDeploymentObj: jest.Mock;
  let mockGetDeploymentsObj: jest.Mock;
  let mockGetDeploymentStatusObj: jest.Mock;
  let mockRequestDeploymentObj: jest.Mock;
  let mockModifyDeploymentObj: jest.Mock;
  let mockDeleteDeploymentObj: jest.Mock;

  let uuid: String;

  beforeEach(() => {
    const apiServer = buildApiServer();
    app = apiServer.getApp();

    Container.bind(DeploymentApi).scope(Scope.Singleton).to(MockDeploymentService);

    const mockService: DeploymentApi = Container.get(DeploymentApi);
    mockGetDeploymentObj = mockService.getDeployment as jest.Mock;
    mockGetDeploymentsObj = mockService.getDeployments as jest.Mock;
    mockGetDeploymentStatusObj = mockService.getDeploymentStatus as jest.Mock;
    mockRequestDeploymentObj = mockService.requestDeployment as jest.Mock;
    mockModifyDeploymentObj = mockService.modifyDeployment as jest.Mock;
    mockDeleteDeploymentObj = mockService.deleteDeployment as jest.Mock;

    uuid = uuidv4();
  });

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

  describe('Given GET /deployments/openshift/${uuid}', () => {
    const expectedResponse = {
      status: "Success",
      deployment: {}
    };

    beforeEach(() => {
      mockGetDeploymentObj.mockReturnValueOnce(Promise.resolve(expectedResponse));
    });

    test('should return an object with a deployment object attached"', done => {
      request(app).get(`/deployments/openshift/${uuid}`).expect(200).expect(expectedResponse, done);
    });
  });

  describe('Given GET /deployments/user/${username}', () => {
    const username = 'Johnny';
    const expectedResponse = {
      apiVersion: "2.0.0",
      date: 1596227871432,
      user: username,
      data: {
        deployments: [],
        tickets: []
      }
    };

    beforeEach(() => {
      mockGetDeploymentsObj.mockImplementation(username => username);
    });

    test('should return an object with deployment and ticket objects attached"', done => {
      request(app).get(`/deployments/user/${username}`).expect(200).expect(expectedResponse, done);
    });
  });

});
